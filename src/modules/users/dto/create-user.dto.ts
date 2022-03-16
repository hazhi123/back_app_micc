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
  @IsNotEmpty()
  celular: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  @IsOptional()
  passwordConfirm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  // Informacion adicional
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  perfil: any

}
