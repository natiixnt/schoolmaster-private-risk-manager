import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentStatus } from '@schoolmaster/core';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listStudentsForClass(schoolId: string, classId: string, includeRisk = false) {
    const select = {
      id: true,
      firstName: true,
      lastName: true,
      externalId: true,
      status: true,
      riskScores: includeRisk
        ? {
            select: { score: true, level: true, calculatedAt: true },
            take: 1,
          }
        : undefined,
    };

    const students = await this.prisma.student.findMany({
      where: { schoolId, classId },
      orderBy: { lastName: 'asc' },
      select,
    });

    if (!includeRisk) {
      return students;
    }

    return students.map((student: any) => {
      const [riskScore] = student.riskScores ?? [];
      const { riskScores, ...rest } = student;
      return { ...rest, riskScore: riskScore ?? null };
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

  // RODO Art. 17 - prawo do bycia zapomnianym: usunięcie wszystkich danych ucznia
  async deleteStudent(schoolId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Kolejność ma znaczenie: najpierw rekordy zależne, potem główny
    await this.prisma.$transaction([
      this.prisma.riskIndicatorValue.deleteMany({ where: { studentId } }),
      this.prisma.riskScore.deleteMany({ where: { studentId } }),
      this.prisma.assessment.deleteMany({ where: { studentId } }),
      this.prisma.attendance.deleteMany({ where: { studentId } }),
      this.prisma.behaviorEvent.deleteMany({ where: { studentId } }),
      this.prisma.parentIssueComment.deleteMany({ where: { issue: { studentId } } }),
      this.prisma.parentIssue.deleteMany({ where: { studentId } }),
      this.prisma.studentActionItem.deleteMany({ where: { actionPlan: { studentId } } }),
      this.prisma.studentActionPlan.deleteMany({ where: { studentId } }),
      this.prisma.student.delete({ where: { id: studentId } }),
    ]);

    return { deleted: true };
  }

  // RODO Art. 20 - prawo do przenośności danych: eksport wszystkich danych ucznia
  async exportStudent(schoolId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
      include: {
        class: true,
        assessments: { orderBy: { date: 'asc' } },
        attendances: { orderBy: { date: 'asc' } },
        behaviorEvents: { orderBy: { date: 'asc' } },
        riskScores: true,
        riskIndicatorValues: { include: { indicator: true } },
        parentIssues: {
          include: { comments: true },
          orderBy: { createdAt: 'asc' },
        },
        actionPlans: {
          include: { items: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
