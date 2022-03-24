import {
  IsArray,
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
  pais: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ciudad: string;

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
  @IsString()
  @IsOptional()
  horarios: string;

  @ApiProperty()
  @IsOptional()
  imageUrl: any;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  galeria: any; // Array de textos

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

}
