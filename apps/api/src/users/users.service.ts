import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserStatus } from '@schoolmaster/core';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsersForSchool(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async createUser(schoolId: string, dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const plainPassword = dto.password ?? crypto.randomBytes(6).toString('base64url');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        role: dto.role,
        hashedPassword,
        schoolId,
        status: dto.status ?? UserStatus.ACTIVE,
      },
      select: { id: true, email: true, role: true, status: true },
    });

    return { ...user, temporaryPassword: dto.password ? undefined : plainPassword };
  }

  async updateUser(schoolId: string, id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({ where: { id, schoolId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, role: true, status: true },
    });
  }
}
