import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: unknown, user: unknown, info: unknown, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException((info as any)?.message ?? 'Unauthorized');
    }
    return user;
  }
}
