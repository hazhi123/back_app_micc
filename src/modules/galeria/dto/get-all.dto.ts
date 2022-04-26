import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllDto {

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  entidad: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  entId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  titular: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  refId: number;


}
