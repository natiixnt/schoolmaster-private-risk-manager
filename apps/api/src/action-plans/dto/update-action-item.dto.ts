import { StudentActionItemStatus } from '@prisma/client';

export class UpdateActionItemDto {
  description?: string;
  status?: StudentActionItemStatus;
  dueDate?: Date | string | null;
  ownerUserId?: string;
}
