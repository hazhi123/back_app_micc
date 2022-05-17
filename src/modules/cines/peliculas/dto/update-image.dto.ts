import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pelicula: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTrailer: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBack: boolean;

}
