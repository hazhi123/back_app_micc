import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateParametrosDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  panorama: number;

  @ApiProperty()
  @IsNotEmpty()
  latitud: any;

  @ApiProperty()
  @IsNotEmpty()
  longitud: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  texto: string;

  @ApiProperty()
  @IsNotEmpty()
  height: any;

  @ApiProperty()
  @IsNotEmpty()
  width: any;

  @ApiProperty()
  @IsNotEmpty()
  fontSize: any;
}

