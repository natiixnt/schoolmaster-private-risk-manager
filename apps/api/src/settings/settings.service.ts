import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSchoolSettingsDto } from './dto/update-school-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSchoolSettings(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: { settings: true },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return {
      id: school.id,
      name: school.name,
      city: school.city,
      type: school.type,
      settings: {
        riskGreenMax: school.settings?.riskGreenMax ?? null,
        riskYellowMax: school.settings?.riskYellowMax ?? null,
      },
    };
  }

  async updateSchoolSettings(schoolId: string, dto: UpdateSchoolSettingsDto) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: { settings: true },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    const updatingRisk = dto.riskGreenMax !== undefined || dto.riskYellowMax !== undefined;
    const currentGreen = school.settings?.riskGreenMax ?? null;
    const currentYellow = school.settings?.riskYellowMax ?? null;
    const nextGreen = dto.riskGreenMax ?? currentGreen;
    const nextYellow = dto.riskYellowMax ?? currentYellow;

    if (updatingRisk) {
      if (nextGreen === null || nextYellow === null) {
        throw new BadRequestException('Both riskGreenMax and riskYellowMax must be set');
      }
      if (nextGreen >= nextYellow) {
        throw new BadRequestException('riskGreenMax must be less than riskYellowMax');
      }
      if (nextYellow >= 100) {
        throw new BadRequestException('riskYellowMax must be less than 100');
      }
      if (nextGreen < 0 || nextYellow < 0) {
        throw new BadRequestException('risk thresholds must be non-negative');
      }
    }

    if (dto.name !== undefined || dto.city !== undefined) {
      await this.prisma.school.update({
        where: { id: schoolId },
        data: {
          name: dto.name ?? school.name,
          city: dto.city ?? school.city,
        },
      });
    }

    if (updatingRisk) {
      await this.prisma.schoolSettings.upsert({
        where: { schoolId },
        update: {
          riskGreenMax: nextGreen,
          riskYellowMax: nextYellow,
        },
        create: {
          schoolId,
          riskGreenMax: nextGreen,
          riskYellowMax: nextYellow,
        },
      });
    }

    return this.getSchoolSettings(schoolId);
  }
}
