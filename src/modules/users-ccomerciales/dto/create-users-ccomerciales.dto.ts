import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersCComercialesDto {

  // relaciones
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  ccomerciales: any;

}
