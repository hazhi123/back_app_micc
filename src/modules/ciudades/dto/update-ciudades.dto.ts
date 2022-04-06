import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateCiudadesDto } from './create-ciudades.dto';

export class UpdateCiudadesDto extends PartialType(CreateCiudadesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
