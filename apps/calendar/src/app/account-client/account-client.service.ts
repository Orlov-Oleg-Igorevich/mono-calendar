import { AccountGetExistingUsers, CalendarGetUsersInfo } from '@mono-calendar/contracts';
import { IUserViewModel } from '@mono-calendar/interface';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { RMQError, RMQService } from 'nestjs-rmq';
import { TypedConfigService } from '../common/typed-config/typed-config.service';

@Injectable()
export class AccountClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly rmqService: RMQService,
    private readonly configService: TypedConfigService,
  ) {}

  async checkUsersExist(userId: string, userIds: string[]): Promise<string[]> {
    try {
      const url = [
        this.configService.accountServiceUrl.replace(/\/+$/, ''),
        AccountGetExistingUsers.path.replace(/^\/+/, '').replace(/\/+$/, ''),
        AccountGetExistingUsers.topic.replace(/^\/+/, ''),
      ]
        .filter(Boolean)
        .join('/');
      const { data } = await this.httpService.axiosRef.post<AccountGetExistingUsers.Response>(
        url,
        {
          userIds,
        },
        {
          timeout: this.configService.accountServiceTimeout,
          headers: {
            'X-User-ID': userId,
          },
        },
      );
      return data.userIds;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          throw new ServiceUnavailableException('Calendar service timeout');
        }

        const status = error.response?.status || -1;
        const message = error.response?.data?.message || 'Calendar service error';

        switch (status) {
          case 400:
            throw new BadRequestException(message);
          case 403:
            throw new ForbiddenException(message);
          case 404:
            throw new NotFoundException(message);
          case 422:
            throw new UnprocessableEntityException(message);
          case 503:
            throw new ServiceUnavailableException(message);
          case -1:
            throw new InternalServerErrorException('Account service internal error');
          default:
            throw new ServiceUnavailableException('Account service unavailable');
        }
      }
      throw new ServiceUnavailableException('Account service unavailable');
    }
  }
  async getUsers(userIds: string[]): Promise<IUserViewModel[]> {
    try {
      const users = await this.rmqService.send<
        CalendarGetUsersInfo.Request,
        CalendarGetUsersInfo.Response
      >(CalendarGetUsersInfo.topic, { userIds });
      return users.users;
    } catch (e) {
      if (e instanceof RMQError) throw new ServiceUnavailableException(e.message);
      throw new ServiceUnavailableException('Account service unavailable');
    }
  }
}
