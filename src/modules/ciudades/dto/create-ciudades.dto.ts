import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCiudadesDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pais: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

}
