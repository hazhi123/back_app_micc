import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreatePaisesDto } from './create-paises.dto';

export class UpdatePaisesDto extends PartialType(CreatePaisesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
