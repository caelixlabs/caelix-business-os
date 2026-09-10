import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AccessTokenPayload } from '../../application/services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_SECRET',
        'dev-access-secret',
      ),
    });
  }

  // Whatever this returns becomes `request.user` for the rest of the
  // request lifecycle (consumed by @CurrentUser() and PermissionsGuard).
  validate(payload: AccessTokenPayload): AccessTokenPayload {
    return payload;
  }
}
