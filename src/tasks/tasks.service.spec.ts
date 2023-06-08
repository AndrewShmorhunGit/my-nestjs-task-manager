import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
// Somehow we need to simulate NestJS module.. With NestJS testing tools. Before Every test, every time I want to create dump module which will consist tasks service and repo.. with async beforeEach func..
// 1. Here we wil initialize NestJS module with tasksService and tasksRepository
// 2. We can provide TasksService as a provider, but! TasksService is relies on TasksRepository, and we cant provide TypeORM here).. We will use technique called mocking. And don't forget to compile it!
// 3. For each test we need to provide our variables..
// 4. We are ready for the testing.. getTasks method.

// 1.
describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;

  // 2.
  const mockTasksRepository = () => ({});

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
});
