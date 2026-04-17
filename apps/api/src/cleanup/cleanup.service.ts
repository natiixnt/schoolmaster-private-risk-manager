import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

const REPORT_TTL_DAYS = 90;

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Czyszczenie wygasłych tokenów odświeżających - co godzinę
  @Cron(CronExpression.EVERY_HOUR)
  async cleanExpiredRefreshTokens() {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    if (count > 0) {
      this.logger.log(`Usunięto ${count} wygasłych tokenów odświeżających`);
    }
  }

  // Czyszczenie starych raportów PDF - codziennie o 03:00
  @Cron('0 3 * * *')
  async cleanOldReports() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - REPORT_TTL_DAYS);

    const oldReports = await this.prisma.report.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true, filePath: true },
    });

    const storageRoot = path.resolve(process.env.REPORTS_STORAGE_ROOT ?? 'storage');
    let deleted = 0;

    for (const report of oldReports) {
      const fullPath = path.resolve(storageRoot, report.filePath);
      // Zabezpieczenie przed path traversal - ścieżka musi być wewnątrz katalogu storage
      if (fullPath.startsWith(storageRoot + path.sep)) {
        try {
          await fs.unlink(fullPath);
        } catch {
          // Plik może już nie istnieć - ignorujemy
        }
      }
      await this.prisma.report.delete({ where: { id: report.id } });
      deleted += 1;
    }

    if (deleted > 0) {
      this.logger.log(`Usunięto ${deleted} starych raportów PDF (starszych niż ${REPORT_TTL_DAYS} dni)`);
    }
  }
}
