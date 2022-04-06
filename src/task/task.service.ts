import { UpdateTaskDto } from './../dtos/update-task.dto';
import { CreateTaskDto } from './../dtos/create-task.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'src/types/task.type';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async create(
        task: CreateTaskDto,
        todoId: number,
        ): Promise<Task> {
        const todo = await this.prisma.todos.findUnique({
            where: {
                id: todoId,
            }
        })
        if (!todo) throw new NotFoundException();

        // const parent = await this.prisma.tasks.findUnique({
        //     where: {
        //         id: task.parent,
        //     }
        // })

        const newTask = await this.prisma.tasks.create({
            data: {
                title: task.title,
                description: task.description,
                todo: {
                    connect: {
                        id: todo.id,
                    }
                },
            },
        })

        return newTask;
    }

    async findAll(todoId: number): Promise<Task[]> {
        const todo = await this.prisma.todos.findUnique({
            where: {
                id: todoId,
            }
        })
        if (!todo) throw new NotFoundException();

        const tasks = await this.prisma.tasks.findMany({
            where: {
                todoid: todo.id,
            }
        })

        return tasks;
    }

    async findOne(taskId: number): Promise<Task> {
        const task = await this.prisma.tasks.findUnique({
            where: {
                id: taskId,
            }
        })
        if (!task) throw new NotFoundException();

        return task;
    }

    async update(taskId, updateTastDto: UpdateTaskDto): Promise<Task> {
        const task = await this.prisma.tasks.findUnique({
            where: {
                id: taskId,
            }
        })
        if (!task) throw new NotFoundException();

        const updateTask = await this.prisma.tasks.update({
            where: {
                id: task.id,
            },
            data: {
                title: updateTastDto.title,
                description: updateTastDto.description,
            }
        })

        return updateTask;
    }

    async delete(taskId): Promise<Task> {
        const task = await this.prisma.tasks.findUnique({
            where: {
                id: taskId,
            }
        })
        if (!task) throw new NotFoundException();

        const delTask = await this.prisma.tasks.delete({
            where: {
                id: task.id,
            }
        })

        return delTask;
    }
}
