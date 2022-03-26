import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddCComercialDto {

  // relaciones
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tipo: number; // 0 = Eliminar --- 1 = Agregar

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ccomercial: number;

}
