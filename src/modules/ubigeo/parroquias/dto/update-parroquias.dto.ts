import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateParroquiasDto } from './create-parroquias.dto';

export class UpdateParroquiasDto extends PartialType(CreateParroquiasDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
