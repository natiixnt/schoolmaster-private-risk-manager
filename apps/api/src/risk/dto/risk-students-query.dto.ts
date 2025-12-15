import { RiskLevel } from '@prisma/client';

export class RiskStudentsQueryDto {
  classId?: string;
  level?: RiskLevel;
  page?: number;
  pageSize?: number;
}
