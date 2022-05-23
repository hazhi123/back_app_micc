import {
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllProductosCategoriasDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ccomercial: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;


}
