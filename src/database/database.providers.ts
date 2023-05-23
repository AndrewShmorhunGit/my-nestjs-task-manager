import { Task } from 'src/tasks/task.entity';
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
      entities: [Task],
      synchronize: true,
    });

    return dataSource.initialize();
  },
};

export const databaseProviders = [dataSourceProvider];