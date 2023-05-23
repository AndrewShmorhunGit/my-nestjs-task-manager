import { FindOneOptions, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.tdo';
import { TaskStatus } from './task-status';
import { Injectable } from '@nestjs/common';

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

  findOne(options: FindOneOptions<Task>) {
    return this.baseRepository.findOne(options);
  }
}
