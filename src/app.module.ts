import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
console.log(process.env.STAGE);
@Module({
  imports: [
    ConfigModule.forRoot({
      // cache: true,
      envFilePath: [
        // `${process.env.STAGE === 'dev' ? './.env.dev' : './.env.prod'}`,
        './.env.dev',
        // `./.env.${process.env.STAGE}`,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'task-management',
    // autoLoadEntities: true,
    // synchronize: true,
    // }),
    DatabaseModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
