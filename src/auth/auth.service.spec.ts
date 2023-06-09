import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/user-credentials.dto';

const mockUsersRepository = () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
});

const mockAuthCredentials: AuthCredentialsDto = {
  username: 'mockUser',
  password: 'herIsAMockPassword!',
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: 'USERS_REPOSITORY',
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get<UsersRepository>('USERS_REPOSITORY');
  });
});
