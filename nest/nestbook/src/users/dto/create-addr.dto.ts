import { IsNotEmpty } from 'class-validator';

export class CreateAddrDto {
  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  detail: string;
}
