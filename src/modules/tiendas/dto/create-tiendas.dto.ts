import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTiendasDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // correo: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // telPrimero: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // telSegundo: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // ubicacion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoria: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // ccomercial: number;

  // @ApiProperty()
  // @IsBoolean()
  // @IsOptional()
  // abierto: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isGastro: boolean;

}
