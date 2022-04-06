import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { Todo } from 'src/types/todo.type';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(todo: CreateTodoDto, userId: number): Promise<Todo> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    if (!user) throw new ForbiddenException("Access Denied");
    
    const newTodo = await this.prisma.todos.create({
      data: {
        title: todo.title,
        description: todo.description,
        userid: user.id,
      },
    })

    return newTodo;
  }

  async findAll(userId: number): Promise<Todo[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    if (!user) throw new ForbiddenException("Access Denied");
    
    const todos = await this.prisma.todos.findMany({
      where: {
        userid: user.id,
      }
    })

    return todos;
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    if (!user) throw new ForbiddenException("Access Denied");

    const todo = await this.prisma.todos.findUnique({
      where: {
        id: id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
          }
        }
      }
    })

    if (!todo) throw new NotFoundException();

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.prisma.todos.findUnique({
      where: {
        id: id,
      }
    })

    if (!todo) throw new NotFoundException();
    
    const updateTodo = await this.prisma.todos.update({
      where: {
        id: todo.id,
      },
      data: {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
      }
    })

    return updateTodo;
  }

  async remove(id: number): Promise<Todo> {
    const todo = await this.prisma.todos.findUnique({
      where: {
        id: id,
      }
    })

    if (!todo) throw new NotFoundException();

    const delTodo = await this.prisma.todos.delete({
      where: {
        id: todo.id
      }
    })

    return delTodo;
  }
}
