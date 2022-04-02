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
  titular: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entidad: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  entId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  refId: number;

}
