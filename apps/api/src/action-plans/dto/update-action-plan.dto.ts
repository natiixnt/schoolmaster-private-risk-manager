import { StudentActionPlanStatus } from '@prisma/client';

export class UpdateActionPlanDto {
  goal?: string;
  status?: StudentActionPlanStatus;
}
