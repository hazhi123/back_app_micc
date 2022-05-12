import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoria: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

}
