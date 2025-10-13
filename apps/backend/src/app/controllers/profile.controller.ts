import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { UserService } from '../services/user.service';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    console.log('user id: ' + req.user.id);
    const user = await this.userService.findById(req.user.id);
    //const user = await this.userService.findById('79003b62-81ee-49a5-acd6-22655974275e');
    if (!user) {
      throw new UnauthorizedException();
    }
    // Remove sensitive fields
    const { password, resetOtp, resetOtpExpiry, ...safeUser } = user;
    return safeUser;
  }
}
