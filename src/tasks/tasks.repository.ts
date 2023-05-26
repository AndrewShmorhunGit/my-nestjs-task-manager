import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { TaskStatus } from './task-status';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository {
  constructor(private baseRepository: Repository<Task>) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.baseRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
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

  async getTaskById(id: string): Promise<Task> {
    const found = await this.baseRepository.findOne({
      where: {
        id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID '${id}' not found!`);
    }
    return found;
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.baseRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(
        `Cant delete task with ID '${id}', task is not found`,
      );
    }
  }

  async updateStatusById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.baseRepository.save(task);
    return task;
  }
}
