import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateMensajesDto } from './create-mensajes.dto';

export class UpdateMensajesDto extends PartialType(CreateMensajesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
