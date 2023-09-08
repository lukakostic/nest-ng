
import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() user: User) {
    return this.authService.register(user);
  }
  /*
  @Post('register2')
  async register2(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  */
}
