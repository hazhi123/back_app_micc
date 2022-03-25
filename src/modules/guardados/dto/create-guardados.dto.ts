import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateGuardadosDto {

  // relaciones
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  publicacion: number;

}
