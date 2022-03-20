import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreatePublicacionesDto } from './create-publicaciones.dto';

export class UpdatePublicacionesDto extends PartialType(CreatePublicacionesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: any;

}
