import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole, UserStatus } from '@schoolmaster/core';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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
    const tokens = await this.generateTokens(user.id, user.schoolId, user.role, user.email);
    return {
      user: {
        id: user.id,
        schoolId: user.schoolId,
        role: user.role,
        email: user.email,
      },
      ...tokens,
    };
  }

  private async storeRefreshToken(userId: string, token: string, expiresAt: Date) {
    const tokenHash = await bcrypt.hash(token, 10);
    await this.prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  private async generateTokens(userId: string, schoolId: string, role: UserRole, email: string) {
    const payload = { sub: userId, schoolId, role, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_TTL,
      secret: this.configService.get<string>('JWT_SECRET', 'dev_secret'),
    });

    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);
    await this.storeRefreshToken(userId, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: REFRESH_TOKEN_TTL_SECONDS,
    };
  }

  async refresh(refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    for (const tokenRow of tokens) {
      const matches = await bcrypt.compare(refreshToken, tokenRow.tokenHash);
      if (matches) {
        const user = tokenRow.user;
        if (user.status !== UserStatus.ACTIVE) {
          throw new UnauthorizedException('User inactive');
        }
        return this.generateTokens(user.id, user.schoolId, user.role, user.email);
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, schoolId: user.schoolId, role: user.role, email: user.email };
  }
}
