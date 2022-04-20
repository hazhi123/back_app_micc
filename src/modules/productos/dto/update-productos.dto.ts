import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateProductosDto } from './create-productos.dto';

export class UpdateProductosDto extends PartialType(CreateProductosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: any;

}
