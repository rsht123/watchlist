import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await this.generateToken(user._id);
    return { ...user.toJSON(), token };
  }

  async signUp(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    await user.save();

    const token = await this.generateToken(user._id);

    return { ...user.toJSON(), token };
  }

  async refreshUser(userId: string) {
    const user = await this.usersService.find(userId);
    const token = await this.generateToken(userId);
    return { ...user.toJSON(), token };
  }

  async generateToken(userId: string) {
    const token = await this.jwtService.signAsync(
      { userId },
      { privateKey: process.env.JWT_SECRET, expiresIn: 60 * 60 * 24 },
    );
    return token;
  }
}
