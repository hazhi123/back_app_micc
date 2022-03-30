import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateContactosDto {

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
  @IsNotEmpty()
  user: number;


}
