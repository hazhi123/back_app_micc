import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfilesModulosDto {

  // relaciones
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  perfil: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  modulos: any;

}
