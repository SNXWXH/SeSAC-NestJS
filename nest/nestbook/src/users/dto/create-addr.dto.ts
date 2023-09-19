import { IsString } from 'class-validator';
import { SuperCreateDto } from 'src/db/super-create.dto';

export class CreateAddrDto extends SuperCreateDto {
  // @IsNotEmpty()
  @IsString()
  street: string;

  // @IsNotEmpty()
  @IsString()
  detail: string;
}
