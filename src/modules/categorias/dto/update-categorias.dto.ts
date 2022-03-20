import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateCategoriasDto } from './create-categorias.dto';

export class UpdateCategoriasDto extends PartialType(CreateCategoriasDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
