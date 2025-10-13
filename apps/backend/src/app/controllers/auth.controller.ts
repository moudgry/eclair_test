import { Controller, Post, Body, HttpException, HttpStatus, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '@eclair_commerce/core';
import { Public } from '../decorators/public.decorator';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { AuthGuard } from '../guards/auth.guard';
import { UserService } from '../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('register')
  @Public()
  async register(@Body() user: Omit<User, 'id'>) {
    try {
      const newUser = await this.authService.register(user);
      const { password, resetOtp, resetOtpExpiry, ...safeUser } = newUser;
      return safeUser;
    } catch (error) {
      console.error('Registration error:', error);
      // Include actual error message from service
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('login')
  @Public()
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(credentials.email, credentials.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  refreshToken(@Req() req: AuthenticatedRequest) {
    return this.authService.sign(req.user.id, 180);
  }

  @Post('request-reset')
  @Public()
  async requestReset(@Body() { email }: { email: string }) {
    try {
      const token = await this.authService.requestPasswordReset(email);
      // In a real app, send email with token
      return { message: 'OTP sent to email' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-otp')
  @Public()
  async verifyOtp(@Body() { email, otp }: { email: string; otp: string }) {
    const isValid = await this.authService.verifyOtp(email, otp);
    return { valid: isValid };
  }

  @Post('reset-password')
  @Public()
  async resetPassword(
    @Body() { email, otp, newPassword }:
    { email: string; otp: string; newPassword: string }
  ) {
    try {
      await this.authService.resetPassword(email, otp, newPassword);
      return { message: 'Password reset successful' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('debug/users')
  @Public()
  async debugUsers() {
    return this.userService.findAll();
  }

  @Get('debug/test')
  @Public()
  async test() {
    return { message: 'Test passed successfully' };
  }
}
