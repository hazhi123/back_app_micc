import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CambioPlanDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  licencia: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  plan: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCancelado: boolean;

}
