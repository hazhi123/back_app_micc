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
  ccomercial: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  cines: number[];


}
