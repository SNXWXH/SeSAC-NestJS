import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type: string;
}
