import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBack: boolean;

}
