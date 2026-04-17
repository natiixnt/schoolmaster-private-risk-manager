import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';

const COOKIE_BASE = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

// secure: true tylko w produkcji - lokalnie HTTP nie obsługuje secure cookies
const isProduction = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Maksymalnie 10 prób logowania na minutę per IP
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto.email, dto.password);
    res.cookie('accessToken', tokens.accessToken, {
      ...COOKIE_BASE,
      secure: isProduction,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...COOKIE_BASE,
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { ok: true };
  }

  // Maksymalnie 20 odświeżeń tokenu na minutę per IP
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Brak tokenu odświeżającego');
    }
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie('accessToken', tokens.accessToken, {
      ...COOKIE_BASE,
      secure: isProduction,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...COOKIE_BASE,
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: AuthRequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.userId);
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthRequestUser) {
    return this.authService.me(user.userId);
  }
}
