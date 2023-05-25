import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

    try {
      await this.baseRepository.save(user);
    } catch (error) {
      if (error.code === `23505`) {
        // duplicate username
        throw new ConflictException(`Username already exist`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
