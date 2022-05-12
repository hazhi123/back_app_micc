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
  tienda: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  index: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isBack: string; // 0 = image 1 = imageBack

}
