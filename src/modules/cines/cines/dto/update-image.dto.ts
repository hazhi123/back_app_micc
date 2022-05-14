import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cine: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isBack: boolean;

}
