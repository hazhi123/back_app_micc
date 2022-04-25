import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateParroquiasDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  municipio: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  parroquia: string;

}
