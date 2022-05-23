import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { createUsuariosDto } from './create-usuarios.dto';

/* eslint-disable prettier/prettier */
export class updatedUsuariosDto extends PartialType(createUsuariosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
