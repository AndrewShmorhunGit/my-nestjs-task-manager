import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY') // Inject Repository
    private usersRepository: UsersRepository,
  ) {}
}
