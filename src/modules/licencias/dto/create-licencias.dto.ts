import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateLicenciasDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licencia: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fechaFinal: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  user: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
