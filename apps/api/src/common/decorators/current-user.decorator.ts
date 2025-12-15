import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '@schoolmaster/core';

export interface AuthRequestUser {
  userId: string;
  schoolId: string;
  role: UserRole;
  email: string;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: AuthRequestUser }>();
  return request.user;
});
