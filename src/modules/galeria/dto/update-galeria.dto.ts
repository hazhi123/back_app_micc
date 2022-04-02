import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateGaleriaDto } from './create-galeria.dto';

export class UpdateGaleriaDto extends PartialType(CreateGaleriaDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
