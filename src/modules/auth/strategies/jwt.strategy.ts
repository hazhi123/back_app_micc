import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { SECRET } from '../../../config';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userService: UsersService,
		private config: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpired: false,
			secretOrKey: config.get<string>(SECRET),
		});
	}

	async validate(payload: any) {
		const { sub: id, isUser } = payload;
		const res = await this.userService.getOne(id)
		return res
	}

}
