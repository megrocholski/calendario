import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TaskService {
  async create(
    title: string,
    desc: string,
    date: Date,
    duration: number,
    userId: string
  ) {
    const task = await prisma.task.create({
      data: {
        title,
        duration,
        desc,
        date,
        finished: false,
        userId,
      },
    });
    return task;
  }

  async update(
    idTask: string,
    title?: string,
    desc?: string,
    date?: Date,
    duration?: number,
    finished?: boolean
  ) {
    const task = await prisma.task.update({
      data: {
        title,
        duration,
        desc,
        date,
        finished,
      },
      where: {
        taskId: idTask,
      },
    });
    return task;
  }

  async show(
    id: string,
    search?: string,
    initialDate?: Date,
    finalDate?: Date
  ) {
    const task = await prisma.task.findFirst({
      where: {
        taskId: id,
        title: {
          contains: search,
        },
        date: {
          lte: finalDate,
          gte: initialDate,
        },
      },
    });
    return task;
  }
  async list(
    idUser: string,
    search?: string,
    initialDate?: Date,
    finalDate?: Date,
    finished?: boolean
  ) {
    const task = await prisma.task.findMany({
      where: {
        userId: idUser,
        title: {
          contains: search,
        },
        date: {
          lte: finalDate,
          gte: initialDate,
        },
        finished: finished,
      },
      orderBy: {
        date: "asc",
      },
    });
    return task;
  }

  async delete(id: string) {
    const task = await prisma.task.delete({
      where: {
        taskId: id,
      },
    });
    return task;
  }
}

export default new TaskService();
