import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateTiposPublicacionDto } from './create-tipos-publicacion.dto';

export class UpdateTiposPublicacionDto extends PartialType(CreateTiposPublicacionDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
