import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import {
  CreateProductosCategoriasDto,
} from './create-productos-categorias.dto';

export class UpdateProductosCategoriasDto extends PartialType(CreateProductosCategoriasDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
