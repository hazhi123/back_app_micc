import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateEstadosDto } from './create-estados.dto';

export class UpdateEstadosDto extends PartialType(CreateEstadosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
