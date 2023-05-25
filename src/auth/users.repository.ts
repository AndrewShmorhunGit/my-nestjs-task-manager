import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(private baseRepository: Repository<User>) {}
}
