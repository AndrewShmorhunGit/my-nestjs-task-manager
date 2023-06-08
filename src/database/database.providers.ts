import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../auth/user.entity';
import { Task } from '../tasks/task.entity';
import { DataSource } from 'typeorm';

export const dataSourceProvider = {
  provide: 'DATA_SOURCE',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [Task, User],
      synchronize: true,
    });

    return dataSource.initialize();
  },
};

export const databaseProviders = [dataSourceProvider];
