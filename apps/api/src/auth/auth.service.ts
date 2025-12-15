import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole, UserStatus } from '@schoolmaster/core';

type JwtUserPayload = {
  sub: string;
  schoolId: string;
  role: UserRole;
  email: string;
};

type RefreshPayload = JwtUserPayload & { jti: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getAccessSecret() {
    return this.configService.get<string>('JWT_SECRET', 'dev_secret');
  }

  private getRefreshSecret() {
    return (
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
      'dev_refresh_secret'
    );
  }

  private getAccessExpiresIn() {
    return this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
  }

  private getRefreshExpiresIn() {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
  }

  private parseDurationToMs(value: string, fallbackMs: number) {
    const trimmed = value?.toString().trim();
    if (!trimmed) return fallbackMs;
    const match = /^(\d+)\s*([smhdw])?$/i.exec(trimmed);
    if (match) {
      const amount = Number(match[1]);
      const unit = (match[2] || 's').toLowerCase();
      const multipliers: Record<string, number> = {
        s: 1000,
        m: 60_000,
        h: 3_600_000,
        d: 86_400_000,
        w: 604_800_000,
      };
      return amount * (multipliers[unit] ?? 1000);
    }

    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric) && numeric > 0) {
      return numeric * 1000;
    }

    return fallbackMs;
  }

  private buildUserPayload(user: { id: string; schoolId: string; role: UserRole; email: string }) {
    return { id: user.id, schoolId: user.schoolId, role: user.role, email: user.email };
  }

  private async storeRefreshToken(id: string, userId: string, token: string, expiresAt: Date) {
    const tokenHash = await bcrypt.hash(token, 10);
    await this.prisma.refreshToken.create({ data: { id, userId, tokenHash, expiresAt } });
  }

  private async generateTokens(user: { id: string; schoolId: string; role: UserRole; email: string }) {
    const payload: JwtUserPayload = {
      sub: user.id,
      schoolId: user.schoolId,
      role: user.role,
      email: user.email,
    };

    const accessExpiresMs = this.parseDurationToMs(this.getAccessExpiresIn(), 15 * 60 * 1000);
    const refreshExpiresMs = this.parseDurationToMs(this.getRefreshExpiresIn(), 7 * 24 * 60 * 60 * 1000);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getAccessExpiresIn(),
    });

    const jti = crypto.randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti },
      {
        secret: this.getRefreshSecret(),
        expiresIn: this.getRefreshExpiresIn(),
      },
    );

    const expiresAt = new Date(Date.now() + refreshExpiresMs);
    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id, expiresAt: { lt: new Date() } },
    });
    await this.storeRefreshToken(jti, user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: Math.floor(accessExpiresMs / 1000),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const tokens = await this.generateTokens(user);
    return {
      user: this.buildUserPayload(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    let payload: RefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload?.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
      include: { user: true },
    });

    if (!stored || stored.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (stored.expiresAt <= new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: payload.jti } }).catch(() => undefined);
      throw new UnauthorizedException('Refresh token expired');
    }

    const matches = await bcrypt.compare(refreshToken, stored.tokenHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = stored.user;
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User inactive');
    }

    await this.prisma.refreshToken.delete({ where: { id: payload.jti } }).catch(() => undefined);
    const tokens = await this.generateTokens(user);

    return {
      user: this.buildUserPayload(user),
      ...tokens,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.buildUserPayload(user);
  }
}
