import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class UsersRepository {
  constructor(private baseRepository: Repository<User>) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.baseRepository.create({
      username,
      password,
    });

    await this.baseRepository.save(user);
  }
}
