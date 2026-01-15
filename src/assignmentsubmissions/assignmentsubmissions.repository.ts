import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
