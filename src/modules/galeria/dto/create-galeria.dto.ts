import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateGaleriaDto {

  // relaciones

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entidad: string; // user-tienda-ccomercial

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  entId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  referencia: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  refId: number;

}
