import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateActionPlanDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  goal!: string;
}
