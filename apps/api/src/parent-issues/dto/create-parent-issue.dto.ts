import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ParentIssueCategory, ParentIssuePriority } from '@prisma/client';

export class CreateParentIssueDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(ParentIssueCategory)
  category?: ParentIssueCategory;

  @IsOptional()
  @IsEnum(ParentIssuePriority)
  priority?: ParentIssuePriority;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
