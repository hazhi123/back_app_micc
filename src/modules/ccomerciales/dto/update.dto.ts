import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';

import { CreateCComercialesDto } from './create.dto';

export class UpdateCComercialesDto extends PartialType(CreateCComercialesDto) {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: any;

}
