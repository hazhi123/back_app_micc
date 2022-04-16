import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllxAtributoDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pais: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
