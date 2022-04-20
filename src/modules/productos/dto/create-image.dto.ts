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
  entId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producto: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  index: string;

}
