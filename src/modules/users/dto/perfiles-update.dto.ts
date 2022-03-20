import { PartialType } from '@nestjs/swagger';
import { updatedUsersDto } from './update-user.dto';

/* eslint-disable prettier/prettier */
export class perfilesUpdateDto extends PartialType(updatedUsersDto) {

}
