import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from '@/core/users/users.module';
import { AuthController } from './presentation/controllers/auth.controller';

import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories';
import { RefreshTokenPrismaRepository } from './infrastructure/prisma/refresh-token.prisma.repository';
import { JwtStrategy } from './infrastructure/passport/jwt.strategy';

import { PasswordHasherService } from '../../common/security/password-hasher.service';
import { TokenService } from './application/services/token.service';
import { AuthSessionService } from './application/services/auth-session.service';

import { RegisterHandler } from './application/register/register.handler';
import { LoginHandler } from './application/login/login.handler';
import { RefreshHandler } from './application/refresh/refresh.handler';
import { LogoutHandler } from './application/logout/logout.handler';

import { JwtAuthGuard } from './application/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/core/rbac/application/guards/permissions.guard';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    UsersModule,
    OrganizationModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    PasswordHasherService,
    TokenService,
    AuthSessionService,
    JwtStrategy,
    RegisterHandler,
    LoginHandler,
    RefreshHandler,
    LogoutHandler,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenPrismaRepository,
    },
    // Applied globally: every route requires a valid access token
    // unless marked @Public(), and every route additionally requires
    // its declared @RequirePermissions() (if any) to be satisfied.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AuthModule {}
