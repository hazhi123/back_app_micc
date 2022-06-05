import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class BorrarCComercialDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tienda: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  ccomerciales: number[];

}
