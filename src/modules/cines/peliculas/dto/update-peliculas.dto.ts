import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreatePeliculasDto } from './create-peliculas.dto';

export class UpdatePeliculasDto extends PartialType(CreatePeliculasDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
