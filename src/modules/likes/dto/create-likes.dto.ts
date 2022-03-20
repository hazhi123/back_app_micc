import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateLikesDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  publicacion: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;

}
