import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePeliculasDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoria: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duracion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sinopsis: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

}
