import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateParentIssueCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  comment!: string;
}
