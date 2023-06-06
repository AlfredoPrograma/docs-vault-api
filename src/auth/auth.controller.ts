import { Body, Controller, Get, Post } from '@nestjs/common';

import {
  CreateUserDto,
  CurrentUserFromToken,
  SignInUserDto,
} from '@/core/models/user';

import { AuthService } from './auth.service';
import { PrivateAccess } from './decorators/access-control.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() payload: CreateUserDto) {
    return await this.authService.signUp(payload);
  }

  @Post('sign-in')
  async signIn(@Body() payload: SignInUserDto) {
    return await this.authService.signIn(payload);
  }

  @Get('test')
  @PrivateAccess()
  async test(@CurrentUser() user: CurrentUserFromToken) {
    return user;
  }
}
