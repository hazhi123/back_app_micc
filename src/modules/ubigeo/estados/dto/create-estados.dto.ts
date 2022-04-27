import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateEstadosDto {

  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // pais: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  estado: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsBoolean()
  // status: boolean;

}
