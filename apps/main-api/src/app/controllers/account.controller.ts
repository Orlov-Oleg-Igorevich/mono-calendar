import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import {
  RegisterDto,
  LoginDto,
  ConfirmEmailDto,
  ChangeProfileDto,
  LoginByTokenDto,
  ExitDto,
  LogoutDto,
  GetUserDto,
  GetProfileDto,
  DeleteUserDto,
  GetMailMatchesDto,
} from '@mono-calendar/dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { REFRESH_TOKEN_NOT_FOUND } from '../constans/authentication.constans';

@Controller(LoginDto.path)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post(RegisterDto.topic)
  async register(@Body() dto: RegisterDto.Request): Promise<RegisterDto.Response> {
    await this.accountService.registerUser(dto);
    return {};
  }

  @HttpCode(200)
  @Post(LoginDto.topic)
  async login(
    @Body() dto: LoginDto.Request,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginDto.Response> {
    const accountResponse = await this.accountService.loginUser({
      ...dto,
      userAgent: req.headers['user-agent'] ?? '',
    });
    res.cookie('refresh_token', accountResponse.refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      path: '/api/account',
      maxAge: accountResponse.maxAge * 1000,
    });
    return {
      accessToken: accountResponse.accessToken,
      expiresIn: accountResponse.expiresIn,
    };
  }

  @HttpCode(200)
  @Post(ConfirmEmailDto.topic)
  async confirmEmail(@Body() dto: ConfirmEmailDto.Request): Promise<ConfirmEmailDto.Response> {
    await this.accountService.confirmUserEmail(dto);
    return {};
  }

  @Get(LoginByTokenDto.topic)
  async loginUseToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginByTokenDto.Response> {
    const oldRefreshToken = req?.cookies?.['refresh_token'];
    if (typeof oldRefreshToken !== 'string') {
      throw new BadRequestException(REFRESH_TOKEN_NOT_FOUND);
    }
    const accountResponse = await this.accountService.loginUseToken({
      token: oldRefreshToken,
      sign: req.headers['user-agent'] ?? '',
    });
    res.cookie('refresh_token', accountResponse.refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      path: '/api/account',
      maxAge: accountResponse.maxAge * 1000,
    });
    return {
      accessToken: accountResponse.accessToken,
      expiresIn: accountResponse.expiresIn,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(ExitDto.topic)
  async exit(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ExitDto.Response> {
    await this.accountService.exitUserAccount(
      req.user.id,
      req.user.token,
      req?.cookies?.['refresh_token'],
    );
    res.cookie('refresh_token', '', {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      path: '/api/account',
      maxAge: 0,
    });
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Get(LogoutDto.topic)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutDto.Response> {
    await this.accountService.logoutUser(req.user.id, req.user.token);
    res.cookie('refresh_token', '', {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      path: '/api/account',
      maxAge: 0,
    });
    return {};
  }

  @Get(GetUserDto.topic)
  async getUser(@Param('id') userId: string): Promise<GetUserDto.Response> {
    return this.accountService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(GetProfileDto.topic)
  async getProfile(@Req() req: Request): Promise<GetProfileDto.Response> {
    return this.accountService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(ChangeProfileDto.topic)
  async changeProfile(
    @Req() req: Request,
    @Body() dto: ChangeProfileDto.Request,
  ): Promise<ChangeProfileDto.Response> {
    const userId = req.user.id;
    return this.accountService.changeUser(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(DeleteUserDto.topic)
  async deleteUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DeleteUserDto.Response> {
    await this.accountService.deleteUser(req.user.id, req.user.token);
    res.cookie('refresh_token', '', {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      path: '/api/account',
      maxAge: 0,
    });
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Post(GetMailMatchesDto.topic)
  async getMailMatches(
    @Body() { emailPrefix }: GetMailMatchesDto.Request,
  ): Promise<GetMailMatchesDto.Response> {
    return this.accountService.getMailMatches(emailPrefix);
  }
}
