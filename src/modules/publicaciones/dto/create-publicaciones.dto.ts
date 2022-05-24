import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionesDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fechaInicio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fechaFinal: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  linkRef: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPermanente: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoria: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ccomercial: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tienda: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cine: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tipoPub: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userEditor: number;

}
