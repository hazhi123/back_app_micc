import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateTiendasDto } from './create-tiendas.dto';

export class UpdateTiendasDto extends PartialType(CreateTiendasDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: any;

}
