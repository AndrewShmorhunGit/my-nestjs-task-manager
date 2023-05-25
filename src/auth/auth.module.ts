import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { DataSource } from 'typeorm';
import { dataSourceProvider } from 'src/database/database.providers';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        new UsersRepository(dataSource.getRepository(User)),
      inject: ['DATA_SOURCE'],
    },
    dataSourceProvider,
  ],
})
export class AuthModule {}
