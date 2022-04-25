import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable prettier/prettier */
export class createUsersDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({
    default: '',
    description: 'El correo electrónico de su cuenta debe ser único.',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  celular: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  @IsOptional()
  passwordConfirm: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  perfil: any

  // Informacion adicional
  @ApiProperty()
  @IsString()
  @IsOptional()
  dni: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telefono: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  direccion: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  parroquia: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ciudad: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ccomercial: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tienda: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVisitante: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTienda: boolean;


}
