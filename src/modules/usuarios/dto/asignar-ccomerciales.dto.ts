import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AsignarCComercialesDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  usuario: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  ccomerciales: number[];

}
