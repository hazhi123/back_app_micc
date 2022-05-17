import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pelicula: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  index: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isTrailer: string; // 0 = no 1 = si

  @ApiProperty()
  @IsString()
  @IsOptional()
  isBack: string; // 0 = image 1 = imageBack

}
