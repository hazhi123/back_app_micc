import {
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetAllDto {

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  select: any = [];

}
