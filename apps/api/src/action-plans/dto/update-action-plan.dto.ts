import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { StudentActionPlanStatus } from '@prisma/client';

export class UpdateActionPlanDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  goal?: string;

  @IsOptional()
  @IsEnum(StudentActionPlanStatus)
  status?: StudentActionPlanStatus;
}
