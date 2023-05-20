import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.tdo';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  // tasksService: TasksService;
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterDto).length) {
  //     return this.tasksService.getTasksWithFilters(filterDto);
  //   }

  //   return this.tasksService.getAllTasks();
  // }

  // // @Get()
  // // getAllTasks(): Task[] {
  // //   return this.tasksService.getAllTasks();
  // // }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Delete('/:id')
  // deleteTaskById(@Param('id') id: string): void {
  //   return this.tasksService.deleteTaskById(id);
  // }

  // @Patch('/:id/status')
  // updateStatusById(
  //   @Param('id') id: string,
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  // ): Task {
  //   const { status } = updateTaskStatusDto;
  //   return this.tasksService.updateStatusById(id, status);
  // }

  // @Post()
  // // 1 // createTask(@Body() body) // : Task
  // createTask(
  //   @Body() createTaskDto: CreateTaskDto,
  //   // 2 // @Body('title') title: string,
  //   // 2 // @Body('description') description: string,
  // ): Task {
  //   // 1 // console.log('body', body);
  //   // 2 // console.log('title', title);
  //   // 2 // console.log('description', description);
  //   return this.tasksService.createTask(createTaskDto);
  // }
}
