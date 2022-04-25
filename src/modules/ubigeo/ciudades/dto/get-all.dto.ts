import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pais: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
