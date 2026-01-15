import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAssignmentDto) {
    return this.prisma.assignment.create({ data: dto });
  }

  findAll() {
    return this.prisma.assignment.findMany({
      include: {
        lesson: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.assignment.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.assignment.delete({ where: { id } });
  }

  update(id: number, data: UpdateAssignmentDto) {
    return this.prisma.assignment.update({ where: { id }, data });
  }

  findOneWithSubmissions(id: number, studentId: number) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: {
          where: { studentId },
          orderBy: { attempt: 'desc' },
        },
      },
    });
  }
}
