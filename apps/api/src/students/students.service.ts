import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentStatus } from '@schoolmaster/core';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listStudentsForClass(schoolId: string, classId: string) {
    return this.prisma.student.findMany({
      where: { schoolId, classId },
      orderBy: { lastName: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        externalId: true,
        status: true,
      },
    });
  }

  async createMany(
    schoolId: string,
    classId: string,
    students: Array<{ firstName: string; lastName: string; externalId?: string | null }>,
  ) {
    const payload = students.map((s) => ({
      schoolId,
      classId,
      firstName: s.firstName,
      lastName: s.lastName,
      externalId: s.externalId,
      status: StudentStatus.ACTIVE,
    }));
    if (payload.length === 0) return { count: 0 };
    return this.prisma.student.createMany({ data: payload, skipDuplicates: true });
  }
}
