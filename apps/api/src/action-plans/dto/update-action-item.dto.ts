import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { StudentActionItemStatus } from '@prisma/client';

export class UpdateActionItemDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(StudentActionItemStatus)
  status?: StudentActionItemStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @IsOptional()
  @IsUUID()
  ownerUserId?: string;
}
