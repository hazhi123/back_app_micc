import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AsignarPeliculasDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cine: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  peliculas: number[];


}
