import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../services/token.service';

interface RequestWithUser {
  user: AccessTokenPayload;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return data ? request.user?.[data] : request.user;
  },
);
