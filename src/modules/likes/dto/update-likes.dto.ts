import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateLikesDto } from './create-likes.dto';

export class UpdateLikesDto extends PartialType(CreateLikesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: any;

}
