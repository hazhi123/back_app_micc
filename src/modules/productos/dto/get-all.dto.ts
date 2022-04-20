import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tienda: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  filtro: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
