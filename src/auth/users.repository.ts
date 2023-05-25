import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private baseRepository: Repository<User>) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.baseRepository.create({
      username,
      password: hashedPassword,
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

  findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.baseRepository.findOne(options);
  }
}
