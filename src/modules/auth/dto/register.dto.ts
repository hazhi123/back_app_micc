import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/* eslint-disable prettier/prettier */
export class RegisterDto {

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
  usuario: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  @IsNotEmpty()
  contrasena: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  @IsOptional()
  contrasenaConfirm: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ciudad: number;

}
