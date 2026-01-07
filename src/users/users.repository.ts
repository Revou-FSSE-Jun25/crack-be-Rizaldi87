import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: CreateUserDto) {
    const { password, ...rest } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const { password, ...rest } = dto;
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(password && { password: await bcrypt.hash(password, 10) }),
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async delete(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
