import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entidad: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  panorama: string;

}
