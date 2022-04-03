import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entidad: string; //ccomercial - tienda

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  publicacion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  index: string;

}
