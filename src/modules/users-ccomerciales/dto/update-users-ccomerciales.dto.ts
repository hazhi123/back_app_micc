import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateUsersCComercialesDto } from './create-users-ccomerciales.dto';

export class UpdateUsersCComercialesDto extends PartialType(CreateUsersCComercialesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
