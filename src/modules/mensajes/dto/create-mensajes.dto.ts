import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateMensajesDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  contacto: number;


}
