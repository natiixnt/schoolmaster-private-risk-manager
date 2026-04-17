import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ParentIssueCategory, ParentIssuePriority, ParentIssueStatus } from '@prisma/client';

export class UpdateParentIssueDto {
  @IsOptional()
  @IsEnum(ParentIssueStatus)
  status?: ParentIssueStatus;

  @IsOptional()
  @IsEnum(ParentIssuePriority)
  priority?: ParentIssuePriority;

  @IsOptional()
  @IsUUID()
  assignedToUserId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(ParentIssueCategory)
  category?: ParentIssueCategory;
}
