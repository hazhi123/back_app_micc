import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateContactosDto } from './create-contactos.dto';

export class UpdateContactosDto extends PartialType(CreateContactosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
