import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel, UserAttributes } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { User } from '@eclair_commerce/core';
import * as bcrypt from 'bcrypt';
import { Op, WhereOptions } from 'sequelize';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    // Use @InjectModel with the model class
    @InjectModel(UserModel)
    private userRepository: typeof UserModel,
    private jwtService: JwtService
  ) {}

  async register(userData: Omit<User, 'id'>): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'customer' // Ensure role is set
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    //console.log('test8888888-' + email + "-" + password + "-" + user.password);
    if (user && await bcrypt.compare(password, user.password)) {
      return user.get({ plain: true });
    }
    return null;
  }

  async login(user: User): Promise<{ token: string }> {
    const payload = { userId: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async sign(userId: string, expiresIn: number): Promise<{ token: string }> {
    const newToken = this.jwtService.sign(
      { userId: userId },
      { expiresIn: expiresIn }
    );
    return { token: newToken };
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    //const resetOtp = Math.random().toString(36).slice(2);
    //const resetOtp = crypto.randomBytes(32).toString('hex');
    const resetOtp = Math.floor(1000 + Math.random() * 9000).toString();
    //const resetOtpExpiry = new Date(Date.now() + 3600000); // 1 hour
    const resetOtpExpiry = new Date(Date.now() + 600000); // 10 minutes

    //await user.update({ resetOtp, resetOtpExpiry });

    // Use type-safe update
    await user.update({
      resetOtp,
      resetOtpExpiry
    } as Partial<UserAttributes>);

    //// Direct property assignment
    //user.resetOtp = resetOtp;
    //user.resetOtpExpiry = resetOtpExpiry;
    //await user.save(); // Save the changes

    return resetOtp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        resetOtp: otp,
        resetOtpExpiry: { [Op.gt]: new Date() }
      }
    });
    return !!user;
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    // Create type-safe where options
    const now = new Date();
    const where: WhereOptions<UserModel> = {
      email: email,
      resetOtp: otp,
      //resetOtpExpiry: { [Op.gt]: new Date() }
      resetOtpExpiry: {
        [Op.gt]: new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        ))
      }
    };
    //const where: WhereOptions<UserModel> = {
    //  resetOtp: otp,
    //  resetOtpExpiry: { [Op.gt]: new Date() }
    //} as WhereOptions<UserModel>;

    const user = await this.userRepository.findOne({ where });
    if (!user) {
      throw new HttpException('Invalid or expired otp', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Use direct assignment instead of update
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();
  }
}
