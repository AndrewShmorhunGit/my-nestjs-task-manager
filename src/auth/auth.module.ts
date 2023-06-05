import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';
import { dataSourceProvider } from '../database/database.providers';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        new UsersRepository(dataSource.getRepository(User)),
      inject: ['DATA_SOURCE'],
    },
    dataSourceProvider,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
