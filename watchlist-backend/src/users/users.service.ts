import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  private logger = new Logger();

  findAll() {
    return this.userModel.find({});
  }

  async find(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(email: string, password: string) {
    const user = await this.userModel.create({ email, password });

    return user.save();
  }

  updateUser(body: Partial<User>, userId: string) {
    console.log({ body, userId });
    return this.userModel.updateOne({ _id: userId }, body).exec();
  }

  async getAuthHeader(userId?: string) {
    // https://api.themoviedb.org/4/auth/request_token

    if (!userId) {
      return `Bearer ${this.config.get('APP_TOKEN')}`;
    }

    const user = await this.userModel.findById(userId).exec();
    if (user.toJSON().tokenV4) {
      console.log({ header: user.toJSON().tokenV4 });
      return `Bearer ${user.toJSON().tokenV4}`;
    } else {
      return `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYmY0MzMxNjM0ZjM4ZWM3NmM0ZTI2MGNmNDMwNGU3ZCIsInN1YiI6IjY0OWM1ZDQ1YWY1OGNiMDBlMmE4NDIyMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nx05q-C0q701ZFgr1wK9k2sbUL5zWCYuSPH0O63Bxb8`;
    }
  }

  async getAuthToken(userId?: string) {
    // https://api.themoviedb.org/4/auth/request_token

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const user = await this.userModel.findById(userId).exec();
    if (user.toJSON().tokenV3) {
      return user.toJSON().tokenV3;
    } else {
      return null;
    }
  }

  async getAuthTokenV4(userId?: string) {
    // https://api.themoviedb.org/4/auth/request_token

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const user = await this.userModel.findById(userId).exec();
    if (user.toJSON().account_id) {
      return user.toJSON().account_id;
    } else {
      return null;
    }
  }

  private async setAuthHeader(userId?: string, tokenType?: string) {
    if (!userId) {
      this.httpService.axiosRef.defaults.headers.common.Authorization = `Bearer ${this.config.get(
        'APP_TOKEN',
      )}`;
      console.log(this.httpService.axiosRef.defaults);
      return;
    }
    const user = await this.userModel.findById(userId).exec();
    if (user[tokenType]) {
      this.httpService.axiosRef.defaults.headers.common.Authorization = `Bearer ${user[tokenType]}`;
      return;
    }
  }

  async createRequestToken(userId: string) {
    await this.setAuthHeader();
    // console.log({ token });
    try {
      const response = await this.httpService.axiosRef.post(
        `4/auth/request_token`,
        {
          redirect_to: `${this.config.get(
            'FRONTEND_URL',
          )}/profile?authorize=true`,
        },
      );
      await this.userModel
        .updateOne(
          { _id: userId },
          { $set: { request_token: response.data.request_token } },
        )
        .exec();
      return response.data;
    } catch (err) {
      console.log(err);
      this.logger.error(err);
    }
  }

  async authorizeRequestToken(userId: string) {
    await this.setAuthHeader();
    const { request_token } = await this.userModel.findById(userId).exec();
    try {
      const response = await this.httpService.axiosRef.post(
        `4/auth/access_token`,
        {
          request_token,
        },
      );
      const { access_token, account_id } = response.data;
      console.log({ data: response.data });
      await this.userModel
        .updateOne(
          { _id: userId },
          { $set: { tokenV4: access_token, account_id: account_id } },
        )
        .exec();

      const responseV3 = await this.httpService.axiosRef.post(
        `3/authentication/session/convert/4`,
        {
          access_token,
        },
      );

      await this.userModel
        .updateOne(
          { _id: userId },
          {
            $set: { tokenV3: responseV3.data.session_id },
            $unset: { request_token },
          },
        )
        .exec();
      return { success: true, message: 'Authorized Successfully' };
    } catch (err) {
      console.log(err);
      this.logger.error(err);
    }
  }
}
