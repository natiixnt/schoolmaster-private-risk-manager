import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ParentIssuePriority,
  ParentIssueStatus,
  ParentIssueCategory,
} from '@prisma/client';

@Injectable()
export class ParentIssuesService {
  constructor(private readonly prisma: PrismaService) {}

  async listIssues(params: {
    schoolId: string;
    status?: ParentIssueStatus;
    priority?: ParentIssuePriority;
    classId?: string;
    studentId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: any = {
      schoolId: params.schoolId,
      status: params.status,
      priority: params.priority,
      studentId: params.studentId,
    };
    if (params.classId) {
      where.student = { classId: params.classId };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.parentIssue.findMany({
        where,
        include: {
          student: { include: { class: true } },
          assignedTo: { select: { id: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.parentIssue.count({ where }),
    ]);

    return {
      total,
      page,
      pageSize,
      items: items.map((issue) => ({
        id: issue.id,
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
        createdAt: issue.createdAt,
        student: issue.student
          ? {
              id: issue.student.id,
              firstName: issue.student.firstName,
              lastName: issue.student.lastName,
              class: issue.student.class ? { id: issue.student.class.id, name: issue.student.class.name } : null,
            }
          : null,
        assignedTo: issue.assignedTo
          ? { id: issue.assignedTo.id, name: issue.assignedTo.email }
          : null,
      })),
    };
  }

  async getIssue(id: string, schoolId: string) {
    const issue = await this.prisma.parentIssue.findFirst({
      where: { id, schoolId },
      include: {
        student: { include: { class: true } },
        assignedTo: { select: { id: true, email: true } },
        comments: {
          include: { author: { select: { id: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!issue) throw new NotFoundException('Issue not found');
    return {
      id: issue.id,
      schoolId: issue.schoolId,
      studentId: issue.studentId,
      guardianId: issue.guardianId,
      category: issue.category,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assignedToUserId: issue.assignedToUserId,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      closedAt: issue.closedAt,
      student: issue.student
        ? {
            id: issue.student.id,
            firstName: issue.student.firstName,
            lastName: issue.student.lastName,
            class: issue.student.class ? { id: issue.student.class.id, name: issue.student.class.name } : null,
          }
        : null,
      assignedTo: issue.assignedTo
        ? { id: issue.assignedTo.id, name: issue.assignedTo.email }
        : null,
      comments: issue.comments.map((comment) => ({
        id: comment.id,
        comment: comment.comment,
        createdAt: comment.createdAt,
        author: comment.author ? { id: comment.author.id, name: comment.author.email } : null,
      })),
    };
  }

  async createIssue(data: {
    schoolId: string;
    studentId?: string;
    title: string;
    description?: string;
    category?: ParentIssueCategory;
    priority?: ParentIssuePriority;
  }) {
    if (data.studentId) {
      const student = await this.prisma.student.findFirst({
        where: { id: data.studentId, schoolId: data.schoolId },
      });
      if (!student) throw new NotFoundException('Student not found');
    }
    return this.prisma.parentIssue.create({
      data: {
        schoolId: data.schoolId,
        studentId: data.studentId ?? null,
        title: data.title,
        description: data.description ?? '',
        category: data.category ?? ParentIssueCategory.OTHER,
        priority: data.priority ?? ParentIssuePriority.MEDIUM,
        status: ParentIssueStatus.NEW,
      },
    });
  }

  async updateIssue(id: string, schoolId: string, data: Partial<{ status: ParentIssueStatus; priority: ParentIssuePriority; assignedToUserId?: string | null; description?: string; category?: ParentIssueCategory; }>) {
    const issue = await this.prisma.parentIssue.findFirst({ where: { id, schoolId } });
    if (!issue) throw new NotFoundException('Issue not found');

    if (data.assignedToUserId) {
      const user = await this.prisma.user.findFirst({
        where: { id: data.assignedToUserId, schoolId },
      });
      if (!user) {
        throw new NotFoundException('Assignee not found');
      }
    }

    return this.prisma.parentIssue.update({
      where: { id },
      data: {
        status: data.status ?? issue.status,
        priority: data.priority ?? issue.priority,
        assignedToUserId:
          data.assignedToUserId !== undefined ? data.assignedToUserId : issue.assignedToUserId,
        description: data.description ?? issue.description,
        category: data.category ?? issue.category,
        closedAt:
          data.status && (data.status === ParentIssueStatus.RESOLVED || data.status === ParentIssueStatus.CLOSED_NO_ACTION)
            ? new Date()
            : issue.closedAt,
      },
    });
  }

  async addComment(issueId: string, schoolId: string, authorUserId: string, comment: string) {
    const issue = await this.prisma.parentIssue.findFirst({ where: { id: issueId, schoolId } });
    if (!issue) throw new NotFoundException('Issue not found');
    return this.prisma.parentIssueComment.create({
      data: {
        issueId,
        authorUserId,
        comment,
      },
      include: {
        author: { select: { id: true, email: true } },
      },
    });
  }
}
