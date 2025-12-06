import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CalendarChangeCategory,
  CalendarChangeTask,
  CalendarCreateCategory,
  CalendarCreateTask,
  CalendarDeleteCategory,
  CalendarDeleteTask,
  CalendarGetCalendar,
  CalendarGetCategories,
  CalendarGetTask,
} from '@mono-calendar/contracts';
import { HttpService } from '@nestjs/axios';
import { TypedConfigService } from '../common/typed-config/typed-config.service';
import { AxiosError } from 'axios';

@Injectable()
export class CalendarService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: TypedConfigService,
  ) {}

  async getCalendar(userId: string): Promise<CalendarGetCalendar.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarGetCalendar.path.replace(/^\/+/, ''),
      CalendarGetCalendar.topic.replace(/^\/+/, ''),
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.get<CalendarGetCalendar.Response>(url, {
        timeout: this.configService.calendarServiceTimeout,
        headers: {
          'X-User-ID': userId,
        },
      });
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async getCategories(userId: string): Promise<CalendarGetCategories.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarGetCategories.path.replace(/^\/+/, ''),
      CalendarGetCategories.topic.replace(/^\/+/, ''),
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.get<CalendarGetCategories.Response>(url, {
        timeout: this.configService.calendarServiceTimeout,
        headers: {
          'X-User-ID': userId,
        },
      });
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async getTaskDetails(userId: string, taskId: string): Promise<CalendarGetTask.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarGetTask.path.replace(/^\/+/, ''),
      taskId,
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.get<CalendarGetTask.Response>(url, {
        timeout: this.configService.calendarServiceTimeout,
        headers: {
          'X-User-ID': userId,
        },
      });
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async createTask(
    userId: string,
    dto: CalendarCreateTask.Request,
  ): Promise<CalendarCreateTask.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarCreateTask.path.replace(/^\/+/, ''),
      CalendarCreateTask.topic.replace(/^\/+/, ''),
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.post<CalendarCreateTask.Response>(url, dto, {
        timeout: this.configService.calendarServiceTimeout,
        headers: {
          'X-User-ID': userId,
        },
      });
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    dto: CalendarChangeTask.Request,
  ): Promise<CalendarChangeTask.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarChangeTask.path.replace(/^\/+/, ''),
      taskId,
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.patch<CalendarChangeTask.Response>(
        url,
        dto,
        {
          timeout: this.configService.calendarServiceTimeout,
          headers: {
            'X-User-ID': userId,
          },
        },
      );
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<CalendarDeleteTask.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarDeleteTask.path.replace(/^\/+/, ''),
      taskId,
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.delete<CalendarDeleteTask.Response>(url, {
        timeout: this.configService.calendarServiceTimeout,
        headers: {
          'X-User-ID': userId,
        },
      });
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async deleteCategory(userId: string, categoryId: string): Promise<CalendarDeleteTask.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarDeleteCategory.path.replace(/^\/+/, ''),
      categoryId,
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.delete<CalendarDeleteCategory.Response>(
        url,
        {
          timeout: this.configService.calendarServiceTimeout,
          headers: {
            'X-User-ID': userId,
          },
        },
      );
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    dto: CalendarChangeCategory.Request,
  ): Promise<CalendarChangeCategory.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarChangeCategory.path.replace(/^\/+/, ''),
      categoryId,
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.patch<CalendarChangeCategory.Response>(
        url,
        dto,
        {
          timeout: this.configService.calendarServiceTimeout,
          headers: {
            'X-User-ID': userId,
          },
        },
      );
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }

  async createCategory(
    userId: string,
    dto: CalendarCreateCategory.Request,
  ): Promise<CalendarCreateCategory.Response> {
    const url = [
      this.configService.calendarServiceUrl.replace(/\/+$/, ''),
      CalendarCreateCategory.path.replace(/^\/+/, ''),
      CalendarCreateCategory.topic.replace(/^\/+/, ''),
    ]
      .filter(Boolean)
      .join('/');
    try {
      const { data } = await this.httpService.axiosRef.post<CalendarCreateCategory.Response>(
        url,
        dto,
        {
          timeout: this.configService.calendarServiceTimeout,
          headers: {
            'X-User-ID': userId,
          },
        },
      );
      return data;
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
            throw new InternalServerErrorException('Calendar service internal error');
          default:
            throw new ServiceUnavailableException('Calendar service unavailable');
        }
      }

      throw new ServiceUnavailableException('Calendar service unavailable');
    }
  }
}
