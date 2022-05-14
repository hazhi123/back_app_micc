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
  cine: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isBack: string; // 0 = image 1 = imageBack

}
