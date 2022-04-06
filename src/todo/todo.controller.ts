import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { Request } from 'express';
import { AtGuard } from 'src/common/guards/at.guard';
import { Todo } from 'src/types/todo.type';


@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() todo: CreateTodoDto, @Req() req: Request): Promise<Todo> {
    return this.todoService.create(todo, req.user['id']);
  }

  @UseGuards(AtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: Request): Promise<Todo[]> {
    return this.todoService.findAll(req.user['id']);
  }

  @UseGuards(AtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<Todo> {
    return this.todoService.findOne(+id, req.user['id']);
  }

  @UseGuards(AtGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todoService.update(+id, updateTodoDto);
  }

  @UseGuards(AtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(+id);
  }
}
