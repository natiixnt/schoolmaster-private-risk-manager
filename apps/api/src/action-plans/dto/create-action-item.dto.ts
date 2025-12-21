export class CreateActionItemDto {
  description: string;
  ownerUserId?: string;
  dueDate?: Date | string | null;
}
