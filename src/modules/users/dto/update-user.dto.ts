import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { createUsersDto } from './create-user.dto';

/* eslint-disable prettier/prettier */
export class updatedUsersDto extends PartialType(createUsersDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
