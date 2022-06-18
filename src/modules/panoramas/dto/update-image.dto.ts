import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  panorama: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  galeria: number;

}
