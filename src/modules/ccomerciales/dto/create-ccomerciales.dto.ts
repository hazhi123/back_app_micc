import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCComercialesDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  telPrimero: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telSegundo: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pais: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ciudad: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ubicLatLng: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  abierto: boolean;

}
