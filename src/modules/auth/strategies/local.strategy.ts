import { Strategy } from 'passport-local';

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import * as CONST from '../../../common/constants';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService
	) {
		super({
			usernameField: 'user',
			passwordFiel: 'password'
		});
	}
	// validar_email(email) {
	// 	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	// 	return regex.test(email) ? true : false;
	// }
	async validate(user: string, password: string) {
		let validateUser
		validateUser = await this.authService.validateUser(user, password);
		// if (this.validar_email(user)) {
		// }
		// else {
		// 	validateUser = await this.authService.validateUser('personal', user, password);
		// }
		if (!validateUser) throw new UnauthorizedException(CONST.MESSAGES.USER.WARNING.NO_MATH_PASSWORD)
		return validateUser;
	}
}