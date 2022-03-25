import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateGuardadosDto } from './create-guardados.dto';

export class UpdateGuardadosDto extends PartialType(CreateGuardadosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
