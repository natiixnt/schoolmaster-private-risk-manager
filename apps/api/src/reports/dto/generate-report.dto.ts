import { IsDateString, IsEnum } from 'class-validator';
import { ReportType } from '@prisma/client';

export class GenerateReportDto {
  @IsEnum(ReportType)
  type!: ReportType;

  @IsDateString()
  periodStart!: string;

  @IsDateString()
  periodEnd!: string;
}
