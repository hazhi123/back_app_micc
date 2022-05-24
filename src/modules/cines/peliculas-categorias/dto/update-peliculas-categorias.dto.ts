import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import {
  CreatePeliculasCategoriasDto,
} from './create-peliculas-categorias.dto';

export class UpdatePeliculasCategoriasDto extends PartialType(CreatePeliculasCategoriasDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
