import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { DataSource } from 'typeorm';
import { Task } from './task.entity';
import { DatabaseModule } from '../database/database.module';
import { dataSourceProvider } from '../database/database.providers';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule],
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
