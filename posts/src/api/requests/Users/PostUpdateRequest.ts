import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class PostUpdateRequest {

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  content: string;

}
