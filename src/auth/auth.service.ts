import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY') // Inject Repository
    private usersRepository: UsersRepository,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
}
