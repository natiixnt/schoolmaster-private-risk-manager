import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async listClasses(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        yearLevel: true,
        homeroomTeacherId: true,
      },
    });
  }

  async getClassOrThrow(schoolId: string, id: string) {
    const cls = await this.prisma.class.findFirst({ where: { id, schoolId } });
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }

  async getOrCreateByName(schoolId: string, name: string) {
    const existing = await this.prisma.class.findFirst({ where: { schoolId, name } });
    if (existing) return existing;
    return this.prisma.class.create({ data: { schoolId, name } });
  }
}
