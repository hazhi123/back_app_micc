import {
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllxAtributoDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ccomercial: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tienda: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  user: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
