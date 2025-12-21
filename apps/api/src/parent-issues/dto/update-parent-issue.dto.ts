import { ParentIssueCategory, ParentIssuePriority, ParentIssueStatus } from '@prisma/client';

export class UpdateParentIssueDto {
  status?: ParentIssueStatus;
  priority?: ParentIssuePriority;
  assignedToUserId?: string | null;
  description?: string;
  category?: ParentIssueCategory;
}
