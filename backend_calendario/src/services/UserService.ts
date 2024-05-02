import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
  async create(username: string, name: string, password: string) {
    const user = await prisma.user.create({
      data: {
        username,
        password,
        name,
      },
    });
    return user;
  }

  async update(
    idUser: string,
    username?: string,
    name?: string,
    password?: string
  ) {
    const user = await prisma.user.update({
      data: {
        username,
        name,
        password,
      },
      where: {
        userId: idUser,
      },
    });
    return user;
  }

  async show(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId: id,
      },
    });
    return user;
  }
  async list() {
    const user = await prisma.user.findMany();
    return user;
  }

  async findByLogin(username: string) {
    const usuario = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    return usuario;
  }

  async delete(id: string) {
    const user = await prisma.user.delete({
      where: {
        userId: id,
      },
    });
    return user;
  }
}

export default new UserService();
