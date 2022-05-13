import {
  IsBoolean,
  IsNotEmpty,
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
  @IsString()
  @IsNotEmpty()
  genero: string;

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
