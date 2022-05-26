import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateHorariosDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
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
  @IsString()
  @IsNotEmpty()
  lunes: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  martes: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  miercoles: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jueves: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  viernes: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sabado: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  domingo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feriados: string;


}
