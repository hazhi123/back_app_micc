import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllxAtributoDto {

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

}
