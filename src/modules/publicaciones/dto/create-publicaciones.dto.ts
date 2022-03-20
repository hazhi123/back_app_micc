import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicacionesDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tipo: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  portada: string;

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
  @IsArray()
  @IsOptional()
  images: Array<string>;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoria: any;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userEditor: any;

}
