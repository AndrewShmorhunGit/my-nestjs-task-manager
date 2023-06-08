import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
// 0. Somehow we need to simulate NestJS module.. With NestJS testing tools. Before every test, every time I want to create dump module which will consist tasks service and repo.. with async beforeEach func..
// 1. Here we wil initialize NestJS module with tasksService and tasksRepository
// 2. We can provide TasksService as a provider, but! TasksService is relies on TasksRepository, and we cant provide TypeORM here).. We will use technique called mocking. And don't forget to compile it!
// 3. For each test we need to provide our variables..
// 4. We are ready for the testing.. getTasks method. We will use nested describe blocks.. Inside we will have one test it('')
// 4.1 We know that our tasksService call tasksRepository.getTasks() but it is not available because of ours mockTasksRepository is empty! Wee need to put there a method we need(getTasks) and define it using an jest tools(jest.fn())
// 4.2 Lest start our test from specific conditions which we determine as.. Jne of conditions - getTasks have not been called previously! It is going to be passed with cli command `npm run test:watch` (but it is not pass because of another way of repository creations)

///////////////////////////////////////////

// 2.
const mockTasksRepository = () => ({
  // 4.1
  getTasks: jest.fn(),
});

describe('TaskService', () => {
  // 1.
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;

  // 0.
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    // 3.
    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  // 4.
  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', () => {
      // 4.2
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
    });
  });
});
