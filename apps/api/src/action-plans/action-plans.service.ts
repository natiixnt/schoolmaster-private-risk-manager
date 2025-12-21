import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentActionItemStatus, StudentActionPlanStatus } from '@prisma/client';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { CreateActionPlanDto } from './dto/create-action-plan.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';
import { UpdateActionPlanDto } from './dto/update-action-plan.dto';

@Injectable()
export class ActionPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async listForStudent(studentId: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
      select: { id: true },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const plans = await this.prisma.studentActionPlan.findMany({
      where: { studentId },
      include: { items: { select: { status: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return plans.map((plan) => {
      const itemsCount = { todo: 0, inProgress: 0, done: 0 };
      for (const item of plan.items) {
        if (item.status === StudentActionItemStatus.TODO) itemsCount.todo += 1;
        if (item.status === StudentActionItemStatus.IN_PROGRESS) itemsCount.inProgress += 1;
        if (item.status === StudentActionItemStatus.DONE) itemsCount.done += 1;
      }
      return {
        id: plan.id,
        goal: plan.goal,
        status: plan.status,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
        itemsCount,
      };
    });
  }

  async getPlan(id: string, schoolId: string) {
    const plan = await this.prisma.studentActionPlan.findFirst({
      where: {
        id,
        student: { schoolId },
      },
      include: {
        createdBy: { select: { id: true, email: true } },
        items: {
          include: { owner: { select: { id: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!plan) {
      throw new NotFoundException('Action plan not found');
    }

    return {
      id: plan.id,
      goal: plan.goal,
      status: plan.status,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      createdBy: plan.createdBy,
      items: plan.items.map((item) => ({
        id: item.id,
        description: item.description,
        status: item.status,
        dueDate: item.dueDate,
        owner: item.owner ? { id: item.owner.id, email: item.owner.email } : null,
      })),
    };
  }

  async createPlan(studentId: string, schoolId: string, userId: string, dto: CreateActionPlanDto) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
      select: { id: true },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.studentActionPlan.create({
      data: {
        studentId,
        createdByUserId: userId,
        goal: dto.goal,
        status: StudentActionPlanStatus.OPEN,
      },
    });
  }

  async updatePlan(id: string, schoolId: string, dto: UpdateActionPlanDto) {
    const plan = await this.prisma.studentActionPlan.findFirst({
      where: { id, student: { schoolId } },
    });
    if (!plan) {
      throw new NotFoundException('Action plan not found');
    }

    return this.prisma.studentActionPlan.update({
      where: { id },
      data: {
        goal: dto.goal ?? plan.goal,
        status: dto.status ?? plan.status,
      },
    });
  }

  async addItem(planId: string, schoolId: string, userId: string, dto: CreateActionItemDto) {
    const plan = await this.prisma.studentActionPlan.findFirst({
      where: { id: planId, student: { schoolId } },
      select: { id: true },
    });
    if (!plan) {
      throw new NotFoundException('Action plan not found');
    }

    const ownerUserId = dto.ownerUserId ?? userId;
    const owner = await this.prisma.user.findFirst({
      where: { id: ownerUserId, schoolId },
      select: { id: true },
    });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const dueDate = this.normalizeDueDate(dto.dueDate);

    return this.prisma.studentActionItem.create({
      data: {
        actionPlanId: planId,
        description: dto.description,
        ownerUserId,
        ...(dueDate !== undefined ? { dueDate } : {}),
      },
      include: { owner: { select: { id: true, email: true } } },
    });
  }

  async updateItem(id: string, schoolId: string, dto: UpdateActionItemDto) {
    const item = await this.prisma.studentActionItem.findFirst({
      where: { id, actionPlan: { student: { schoolId } } },
    });
    if (!item) {
      throw new NotFoundException('Action plan item not found');
    }

    let ownerUserId = item.ownerUserId;
    if (dto.ownerUserId) {
      const owner = await this.prisma.user.findFirst({
        where: { id: dto.ownerUserId, schoolId },
        select: { id: true },
      });
      if (!owner) {
        throw new NotFoundException('Owner not found');
      }
      ownerUserId = dto.ownerUserId;
    }

    const dueDate = this.normalizeDueDate(dto.dueDate);
    const data: {
      description?: string;
      status?: StudentActionItemStatus;
      dueDate?: Date | null;
      ownerUserId?: string;
    } = {
      description: dto.description ?? item.description,
      status: dto.status ?? item.status,
      ownerUserId,
    };
    if (dueDate !== undefined) {
      data.dueDate = dueDate;
    }

    return this.prisma.studentActionItem.update({
      where: { id },
      data,
      include: { owner: { select: { id: true, email: true } } },
    });
  }

  private normalizeDueDate(input?: Date | string | null) {
    if (input === undefined) return undefined;
    if (input === null) return null;
    return input instanceof Date ? input : new Date(input);
  }
}
