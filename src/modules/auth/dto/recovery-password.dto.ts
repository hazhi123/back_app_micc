import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RecoveryPasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}
