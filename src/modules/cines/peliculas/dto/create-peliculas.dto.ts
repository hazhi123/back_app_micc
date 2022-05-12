import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePeliculasDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  costo: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

}
