import { IsIn, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  photo: string;

  @IsIn([0, 1, 2, 3])
  role: string;
}
