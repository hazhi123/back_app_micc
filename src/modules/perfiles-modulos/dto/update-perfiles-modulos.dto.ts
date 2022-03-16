import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreatePerfilesModulosDto } from './create-perfiles-modulos.dto';

export class UpdatePerfilesModulosDto extends PartialType(CreatePerfilesModulosDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
