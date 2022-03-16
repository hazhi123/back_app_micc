import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateModulosDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  alias: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  modulo: any

}
