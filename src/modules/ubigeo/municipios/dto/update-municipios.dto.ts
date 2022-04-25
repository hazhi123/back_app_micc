import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateMunicipiosDto } from './create-municipios.dto';

export class UpdateMunicipiosDto extends PartialType(CreateMunicipiosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
