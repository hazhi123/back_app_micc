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
  municipio: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
