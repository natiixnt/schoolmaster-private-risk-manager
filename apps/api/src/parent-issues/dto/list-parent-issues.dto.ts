import { ParentIssuePriority, ParentIssueStatus } from '@prisma/client';

export class ListParentIssuesDto {
  status?: ParentIssueStatus;
  priority?: ParentIssuePriority;
  classId?: string;
  studentId?: string;
  page?: number;
  pageSize?: number;
}
