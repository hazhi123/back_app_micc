import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePaisesDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

}
