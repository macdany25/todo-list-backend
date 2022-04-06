import { UpdateTaskDto } from './../dtos/update-task.dto';
import { AtGuard } from './../common/guards/at.guard';
import { CreateTaskDto } from './../dtos/create-task.dto';
import { TaskService } from './task.service';
import { Controller, Get, Patch, Post, Delete, Body, UseGuards, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { Task } from 'src/types/task.type';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @UseGuards(AtGuard)
    @Post(':todo')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() task: CreateTaskDto,
    @Param('todo', ParseIntPipe) todoId: number
    ): Promise<Task> {
        return this.taskService.create(task, todoId);
    }

    @UseGuards(AtGuard)
    @Get(':todo')
    @HttpCode(HttpStatus.OK)
    findAll(@Param('todo', ParseIntPipe) todoId: number): Promise<Task[]> {
        return this.taskService.findAll(todoId);
    }

    @UseGuards(AtGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.findOne(id);
    }

    @UseGuards(AtGuard)
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTastDto: UpdateTaskDto) {
        return this.taskService.update(id, updateTastDto);
    }

    @UseGuards(AtGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.delete(id);
    }
}
