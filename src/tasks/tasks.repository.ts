import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { TaskStatus } from './task-status';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository {
  private logger = new Logger('TasksRepository', {
    timestamp: true,
  });
  constructor(private baseRepository: Repository<Task>) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.baseRepository.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters : ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.baseRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.baseRepository.save(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.baseRepository.findOne({
      where: {
        id,
        user,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID '${id}' not found!`);
      // throw new NotFoundException(`404 not found!`);
    }
    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.baseRepository.delete({ id, user });
    if (!result.affected) {
      throw new NotFoundException(
        `Cant delete task with ID '${id}', task is not found`,
      );
    }
  }

  async updateStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.baseRepository.save(task);
    return task;
  }
}
