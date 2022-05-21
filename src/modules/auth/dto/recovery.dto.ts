import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RecoveryDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
