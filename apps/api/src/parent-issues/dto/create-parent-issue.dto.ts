import { ParentIssueCategory, ParentIssuePriority } from '@prisma/client';

export class CreateParentIssueDto {
  title: string;
  description?: string;
  category?: ParentIssueCategory;
  priority?: ParentIssuePriority;
  studentId?: string;
}
