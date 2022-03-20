import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateComentariosDto } from './create-comentarios.dto';

export class UpdateComentariosDto extends PartialType(CreateComentariosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: any;

}
