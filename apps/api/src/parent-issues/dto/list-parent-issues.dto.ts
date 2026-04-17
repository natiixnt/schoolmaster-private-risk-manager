import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ParentIssuePriority, ParentIssueStatus } from '@prisma/client';

export class ListParentIssuesDto {
  @IsOptional()
  @IsEnum(ParentIssueStatus)
  status?: ParentIssueStatus;

  @IsOptional()
  @IsEnum(ParentIssuePriority)
  priority?: ParentIssuePriority;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}
