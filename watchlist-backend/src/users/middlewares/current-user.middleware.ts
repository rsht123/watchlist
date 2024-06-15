import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user.schema';
import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      currentUser?: string;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const { userId } = req.session || {};
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      return next();
    }
    try {
      const { userId } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // console.log('userId', userId);
      if (userId) {
        // const user = await this.usersService.find(userId);
        // console.log('user middleware', user);
        req.currentUser = userId;
      }
    } catch (err) {
      console.log('middlewawre err', err);
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
