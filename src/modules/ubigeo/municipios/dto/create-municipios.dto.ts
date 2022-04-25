import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateMunicipiosDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  estado: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  municipio: string;

}
