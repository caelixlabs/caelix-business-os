import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '../../application/decorators';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';

import { RegisterDto } from '../../application/register/register.dto';
import { RegisterCommand } from '../../application/register/register.command';
import { RegisterHandler } from '../../application/register/register.handler';

import { LoginDto } from '../../application/login/login.dto';
import { LoginCommand } from '../../application/login/login.command';
import { LoginHandler } from '../../application/login/login.handler';

import { RefreshDto } from '../../application/refresh/refresh.dto';
import { RefreshCommand } from '../../application/refresh/refresh.command';
import { RefreshHandler } from '../../application/refresh/refresh.handler';

import { LogoutDto } from '../../application/logout/logout.dto';
import { LogoutCommand } from '../../application/logout/logout.command';
import { LogoutHandler } from '../../application/logout/logout.handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerHandler: RegisterHandler,
    private readonly loginHandler: LoginHandler,
    private readonly refreshHandler: RefreshHandler,
    private readonly logoutHandler: LogoutHandler,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    const { user, session } = await this.registerHandler.execute(
      new RegisterCommand(dto),
    );
    console.log('User Request', user, session);
    return AuthResponseDto.from(user, session);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const { user, session } = await this.loginHandler.execute(
      new LoginCommand(dto),
    );
    return AuthResponseDto.from(user, session);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto): Promise<AuthResponseDto> {
    const { user, session } = await this.refreshHandler.execute(
      new RefreshCommand(dto),
    );
    return AuthResponseDto.from(user, session);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: LogoutDto): Promise<void> {
    await this.logoutHandler.execute(new LogoutCommand(dto));
  }
}
