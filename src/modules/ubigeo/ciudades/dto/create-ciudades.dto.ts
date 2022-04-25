import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCiudadesDto {

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  estado: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  capital: number;

}
