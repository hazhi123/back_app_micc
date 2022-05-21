import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handlerRequest(err, usuario, info) {
        if (err || !usuario) {
            throw err || new UnauthorizedException('NO ESTAS AUTHENTICADO');
        }
        return usuario;
    }
}