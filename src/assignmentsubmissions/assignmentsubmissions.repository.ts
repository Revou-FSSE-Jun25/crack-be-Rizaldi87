import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class AssignmentsubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.assignmentSubmission.findMany({
      include: {
        assignment: true,
        student: true,
      },
    });
  }

  create(data) {
    return this.prisma.assignmentSubmission.create({ data });
  }

  updateScore(id: number, score: number) {
    return this.prisma.assignmentSubmission.update({
      where: { id },
      data: { score },
    });
  }

  findByStudentId(studentId: number) {
    return this.prisma.assignmentSubmission.findFirst({
      select: { id: true, score: true, attempt: true, assignmentId: true },
      where: { studentId },
      orderBy: { attempt: 'desc' },
    });
  }

  findMaynyByStudentId(studentId: number) {
    return this.prisma.assignmentSubmission.findMany({
      where: { studentId },
      orderBy: { attempt: 'desc' },
      include: { assignment: { include: { lesson: true } } },
    });
  }
}
