import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateCinesDto } from './create-cines.dto';

export class UpdateCinesDto extends PartialType(CreateCinesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
