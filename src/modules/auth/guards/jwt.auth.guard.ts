import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handlerRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException('NO ESTAS AUTHENTICADO');
        }
        return user;
    }
}