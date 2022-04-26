import {
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  estado: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
