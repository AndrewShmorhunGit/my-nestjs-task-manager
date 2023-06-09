import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';

import { User } from 'src/auth/user.entity';
// import { Task } from './task.entity';
import { TaskStatus } from './task-status';
// import { NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';

///////////////////////////////////////////

// DESCRIPTION of the testing process
// 0. Somehow we need to simulate NestJS module.. With NestJS testing tools. Before every test, every time I want to create dump module which will consist tasks service and repo.. with async beforeEach func..
// 1. Here we wil initialize NestJS module with tasksService and tasksRepository
// 2. We can provide TasksService as a provider, but! TasksService is relies on TasksRepository, and we cant provide TypeORM here).. We will use technique called mocking. And don't forget to compile it!
// 3. For each test we need to provide our variables..
// 4. We are ready for the testing.. getTasks method. We will use nested describe blocks.. Inside we will have one test it('')
// 4.1 We know that our tasksService call tasksRepository.getTasks() but it is not available because of ours mockTasksRepository is empty! Wee need to put there a method we need(getTasks) and define it using an jest tools(jest.fn())
// 4.2 Lest start our test from specific conditions which we determine as.. Jne of conditions - getTasks have not been called previously! It is going to be passed with cli command `npm run test:watch` (but it is not pass because of another way of repository creations)
// Here was a problem with testing module and TasksRepository, because of our TypeORM repository creation..
// Test runs and passed, and then we will continue to add logic:
// 4.3 Next we want to call tasksService.getTasks(), which should then call th repository's getTasks
// 4.4 Let's call tasksService.getTasks() for this we need to look for the arguments it takes.. at `tasks.service.ts` method getTasks receive (filterDto: GetTasksFilterDto, user: User) as filterDto object we can provide {}, as user we will provide mock user..
// 4.4.1 Create mock user
// 4.5 We are still not testing `return` result. How to do this? To equal call ot `var = result` , then expect(result).toEqual('..something').. for this we will use mockTasksRepository,getTasks(jest.function) to crate a mock result(and we need to make current test an async test because of using .mockResolvedValue() method).. for this we have to remove type of tasksRepository, because it not include mock functions as a methods! And finally w are simplifying toHaveBeenCalled methods because if we return something it automatically means that function have been called!

// 5. getTaskById create new describe blocks for two cases, 5.1. return result &  5.2. handle error.
// 5.1
// 5.1.1 All we need for this is to create a mockTask and return it.. lets define it..
// 5.1.2 Create mock method at mockTasksRepository
// 5.1.3 tasksRepository.getTasksById.mockResolvedValue(mockTask); return the mockTask by tasksRepository.getTasksById call
// 5.1.4 Declare result as a function call and provide expectations
// 5.2 For this let's look at our function, whatever tasksRepository.getTaskById returns false, there is an error thrown with NotFoundException() an that is what we want to test
// 5.2.1 Make sure that our mock function returns Promise of `null` (for rejects it should be promise) by tasksRepository.getTasksById.mockRejectedValue(Promise<null>)
// 5.2.2 And write our expectations but as await expect(...).rejects.toThrow()

///////////////////////////////////////////

// 2.
const mockTasksRepository = () => ({
  // 4.1
  getTasks: jest.fn(),
  // 5.1.2
  getTaskById: jest.fn(),
});

// 4.4.1
const mockUser: User = {
  username: 'mockUser',
  id: 'mockId',
  password: 'mockPassword',
  tasks: [],
};

// 5.1.1
const mockTask = {
  id: 'mockId',
  title: 'mockTitle',
  description: 'mockDescription',
  status: TaskStatus.OPEN,
  // user: mockUser,
};

describe('TaskService', () => {
  // 1.
  let tasksService: TasksService;
  let tasksRepository; // : TasksRepository remove type by 4.5 step

  // 0.
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: 'TASKS_REPOSITORY', // That is because of difference repository creation!!(look at the tasks.module)
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    // 3.
    tasksService = module.get(TasksService);
    tasksRepository = module.get<TasksRepository>('TASKS_REPOSITORY');
    // and here the same difference(look at the tasks.module)!
  });

  // 4.
  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      // add async by 4.5 step
      // 4.2
      // expect(tasksRepository.getTasks).not.toHaveBeenCalled(); // simplified by 4.5 step
      // 4.5
      tasksRepository.getTasks.mockResolvedValue('mockResolvedValue'); // we are using mockResolvedValue because we are dealing with promise
      const result = await tasksService.getTasks(null, mockUser); // add await by 4.5 step
      // 4.4
      // tasksService.getTasks(null, mockUser); edited by 4.5 step..
      // 4.3
      // all tasksService.getTasks, which should then call th repository's getTasks
      // expect(tasksRepository.getTasks).toHaveBeenCalled(); // simplified by 4.5 step
      // 4.5
      expect(result).toEqual('mockResolvedValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.getTasksById and returns the result', async () => {
      // 5.1.3
      tasksRepository.getTaskById.mockResolvedValue(mockTask);
      // 5.1.4
      const result = await tasksService.getTaskById('mockId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.getTasksById and handles an error', async () => {
      // 5.2.1
      tasksRepository.getTaskById.mockRejectedValue(Promise<null>);
      // 5.2.2
      await expect(
        tasksService.getTaskById('mockId', mockUser),
      ).rejects.toThrow();
    });
  });
});
