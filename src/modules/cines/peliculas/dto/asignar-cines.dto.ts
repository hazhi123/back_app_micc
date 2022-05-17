import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AsignarCinesDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pelicula: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  cines: number[];

}
