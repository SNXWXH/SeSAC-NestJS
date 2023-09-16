import { IsString } from 'class-validator';

export class CreateAddrDto {
  // @IsNotEmpty()
  @IsString()
  street: string;

  // @IsNotEmpty()
  @IsString()
  detail: string;
}
