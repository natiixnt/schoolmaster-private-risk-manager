import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AttendanceStatus,
  BehaviorSeverity,
  BehaviorType,
  RiskLevel,
  Student,
} from '@prisma/client';

const DEFAULT_PERIOD_DAYS = 90;
const INDICATOR_NAMES = {
  GRADE_DELTA: 'delta_average_grade',
  ATTENDANCE: 'attendance_rate',
  BEHAVIOR: 'negative_events_count',
};

interface CalculationResult {
  student: Student;
  score: number;
  level: RiskLevel;
}

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  async listRiskStudents(params: {
    schoolId: string;
    classId?: string;
    level?: RiskLevel;
    page?: number;
    pageSize?: number;
  }) {
    const { schoolId, classId, level } = params;
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const riskScores = await this.prisma.riskScore.findMany({
      where: {
        level: level ?? undefined,
        student: {
          schoolId,
          classId: classId ?? undefined,
        },
      },
      include: {
        student: {
          include: { class: true },
        },
      },
      orderBy: {
        score: 'desc',
      },
      skip,
      take: pageSize,
    });

    const studentIds = riskScores.map((r) => r.studentId);
    const indicatorValues = await this.prisma.riskIndicatorValue.findMany({
      where: { studentId: { in: studentIds } },
      include: { indicator: true },
    });

    const indicatorsByStudent: Record<string, typeof indicatorValues> = {};
    indicatorValues.forEach((val) => {
      indicatorsByStudent[val.studentId] = indicatorsByStudent[val.studentId] || [];
      indicatorsByStudent[val.studentId].push(val);
    });

    return riskScores.map((risk) => ({
      studentId: risk.studentId,
      firstName: risk.student.firstName,
      lastName: risk.student.lastName,
      class: risk.student.class,
      score: risk.score,
      level: risk.level,
      indicators: (indicatorsByStudent[risk.studentId] || []).map((v) => ({
        name: v.indicator.name,
        value: v.value,
        level: v.level,
      })),
    }));
  }

  async getRiskForStudent(studentId: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
      include: {
        class: true,
        riskScores: true,
        riskIndicatorValues: { include: { indicator: true } },
        behaviorEvents: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const score = student.riskScores?.[0] ?? null;

    return {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        class: student.class,
      },
      score,
      indicators:
        student.riskIndicatorValues?.map((v) => ({
          name: v.indicator.name,
          value: v.value,
          level: v.level,
          calculatedAt: v.calculatedAt,
        })) ?? [],
      recentBehaviorEvents: student.behaviorEvents,
    };
  }

  async recalculateRiskForSchool(schoolId: string, classId?: string) {
    const students = await this.prisma.student.findMany({
      where: {
        schoolId,
        classId: classId ?? undefined,
      },
    });

    let processed = 0;
    for (const student of students) {
      await this.calculateRiskForStudent(student.id, schoolId);
      processed += 1;
    }
    return { processed };
  }

  async calculateRiskForStudent(studentId: string, schoolId: string): Promise<CalculationResult> {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - DEFAULT_PERIOD_DAYS);
    const previousStart = new Date(currentStart);
    previousStart.setDate(currentStart.getDate() - DEFAULT_PERIOD_DAYS);

    const assessments = await this.prisma.assessment.findMany({
      where: { studentId, date: { gte: previousStart } },
    });

    const { avgCurrent, avgPrev, delta } = this.calculateGradeDelta(
      assessments,
      currentStart,
      previousStart,
    );

    const attendance = await this.prisma.attendance.findMany({
      where: { studentId, date: { gte: currentStart } },
    });
    const attendanceRate = this.calculateAttendanceRate(attendance);

    const behaviorEvents = await this.prisma.behaviorEvent.findMany({
      where: { studentId, date: { gte: currentStart } },
    });
    const { negativeCount, hasHigh } = this.calculateBehavior(behaviorEvents);

    let score = 0;
    const indicatorLevels: { name: string; level: RiskLevel; value: any }[] = [];

    if (delta >= 1) {
      score += 35;
      indicatorLevels.push({ name: INDICATOR_NAMES.GRADE_DELTA, level: RiskLevel.RED, value: delta });
    } else if (delta >= 0.5) {
      score += 20;
      indicatorLevels.push({
        name: INDICATOR_NAMES.GRADE_DELTA,
        level: RiskLevel.YELLOW,
        value: delta,
      });
    } else {
      indicatorLevels.push({
        name: INDICATOR_NAMES.GRADE_DELTA,
        level: RiskLevel.GREEN,
        value: delta,
      });
    }

    if (attendanceRate < 0.8) {
      score += 35;
      indicatorLevels.push({
        name: INDICATOR_NAMES.ATTENDANCE,
        level: RiskLevel.RED,
        value: attendanceRate,
      });
    } else if (attendanceRate < 0.9) {
      score += 20;
      indicatorLevels.push({
        name: INDICATOR_NAMES.ATTENDANCE,
        level: RiskLevel.YELLOW,
        value: attendanceRate,
      });
    } else {
      indicatorLevels.push({
        name: INDICATOR_NAMES.ATTENDANCE,
        level: RiskLevel.GREEN,
        value: attendanceRate,
      });
    }

    if (negativeCount >= 3) {
      score += 30;
      indicatorLevels.push({
        name: INDICATOR_NAMES.BEHAVIOR,
        level: RiskLevel.RED,
        value: { negativeCount, hasHigh },
      });
    } else if (negativeCount >= 1 || hasHigh) {
      score += 20;
      indicatorLevels.push({
        name: INDICATOR_NAMES.BEHAVIOR,
        level: RiskLevel.YELLOW,
        value: { negativeCount, hasHigh },
      });
    } else {
      indicatorLevels.push({
        name: INDICATOR_NAMES.BEHAVIOR,
        level: RiskLevel.GREEN,
        value: { negativeCount, hasHigh },
      });
    }

    if (hasHigh) {
      score += 10;
    }

    score = Math.min(100, Math.max(0, score));

    const level = this.mapScoreToLevel(score);

    const definitions = await this.ensureIndicatorDefinitions(student.schoolId);

    await this.prisma.riskIndicatorValue.deleteMany({ where: { studentId } });
    await this.prisma.riskIndicatorValue.createMany({
      data: indicatorLevels.map((ind) => ({
        studentId,
        indicatorId: definitions[ind.name],
        value: ind.value as any,
        level: ind.level,
        calculatedAt: new Date(),
      })),
    });

    await this.prisma.riskScore.upsert({
      where: { studentId },
      update: { score, level, calculatedAt: new Date() },
      create: { studentId, score, level, calculatedAt: new Date() },
    });

    return { student, score, level };
  }

  private mapScoreToLevel(score: number): RiskLevel {
    if (score <= 30) return RiskLevel.GREEN;
    if (score <= 60) return RiskLevel.YELLOW;
    return RiskLevel.RED;
  }

  private calculateGradeDelta(
    assessments: { gradeValue: any; date: Date }[],
    currentStart: Date,
    previousStart: Date,
  ) {
    const toNumber = (v: any) => Number(v);
    const currentGrades = assessments.filter((a) => a.date >= currentStart).map((a) => toNumber(a.gradeValue));
    const prevGrades = assessments
      .filter((a) => a.date < currentStart && a.date >= previousStart)
      .map((a) => toNumber(a.gradeValue));

    const avg = (arr: number[]) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);
    const avgCurrent = avg(currentGrades);
    const avgPrev = avg(prevGrades);
    const delta = avgPrev - avgCurrent;
    return { avgCurrent, avgPrev, delta };
  }

  private calculateAttendanceRate(attendance: { status: AttendanceStatus }[]) {
    if (!attendance.length) return 1;
    const total = attendance.length;
    const presentCount = attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length;
    return total ? presentCount / total : 1;
  }

  private calculateBehavior(events: { type: BehaviorType; severity: BehaviorSeverity }[]) {
    const negative = events.filter((e) =>
      (e.type === BehaviorType.INCIDENT || e.type === BehaviorType.WARNING) &&
      (e.severity === BehaviorSeverity.MEDIUM || e.severity === BehaviorSeverity.HIGH),
    );
    const negativeCount = negative.length;
    const hasHigh = negative.some((e) => e.severity === BehaviorSeverity.HIGH);
    return { negativeCount, hasHigh };
  }

  private async ensureIndicatorDefinitions(schoolId: string) {
    const mapping: Record<string, string> = {};
    for (const def of [
      {
        name: INDICATOR_NAMES.GRADE_DELTA,
        description: 'Change in average grade (prev - current)',
      },
      {
        name: INDICATOR_NAMES.ATTENDANCE,
        description: 'Attendance rate in the period',
      },
      {
        name: INDICATOR_NAMES.BEHAVIOR,
        description: 'Negative behavior events count',
      },
    ]) {
      const existing =
        (await this.prisma.riskIndicatorDefinition.findFirst({
          where: { name: def.name, schoolId },
        })) ||
        (await this.prisma.riskIndicatorDefinition.findFirst({
          where: { name: def.name, schoolId: null },
        }));
      const created =
        existing ||
        (await this.prisma.riskIndicatorDefinition.create({
          data: {
            name: def.name,
            description: def.description,
            schoolId,
            configJson: {},
          },
        }));
      mapping[def.name] = created.id;
    }
    return mapping;
  }
}
