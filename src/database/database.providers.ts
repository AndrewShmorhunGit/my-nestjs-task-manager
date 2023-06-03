import { User } from '../auth/user.entity';
import { Task } from '../tasks/task.entity';
import { DataSource } from 'typeorm';

export const dataSourceProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      entities: [Task, User],
      synchronize: true,
    });

    return dataSource.initialize();
  },
};

export const databaseProviders = [dataSourceProvider];
