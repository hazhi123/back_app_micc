import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateComentariosDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  publicacion: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comentario: string;

}
