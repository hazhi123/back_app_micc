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
  categoria: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tipoPub: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
