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
  tienda: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  file: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  index: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBack: boolean;

}
