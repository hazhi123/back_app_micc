import {
  IsBoolean,
  IsEmail,
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
  @IsString()
  @IsOptional()
  ubicacion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  user: any;

}
