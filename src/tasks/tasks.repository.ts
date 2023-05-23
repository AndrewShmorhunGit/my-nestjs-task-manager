import { FindOneOptions, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { TaskStatus } from './task-status';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksRepository {
  constructor(private baseRepository: Repository<Task>) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.baseRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
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
}
