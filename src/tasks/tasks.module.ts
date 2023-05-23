import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { DataSource } from 'typeorm';
import { Task } from './task.entity';
import { DatabaseModule } from 'src/database/database.module';
import { dataSourceProvider } from 'src/database/database.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'TASKS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        new TasksRepository(dataSource.getRepository(Task)),
      inject: ['DATA_SOURCE'],
    },
    dataSourceProvider,
  ],
})
export class TasksModule {}
