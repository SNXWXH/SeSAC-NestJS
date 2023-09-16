import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  photo: string;

  @IsIn([0, 1, 2, 3])
  @IsOptional()
  role: number;
}
