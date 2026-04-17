import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { ImportModule } from './importer/import.module';
import { RiskModule } from './risk/risk.module';
import { ParentIssuesModule } from './parent-issues/parent-issues.module';
import { ActionPlansModule } from './action-plans/action-plans.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { CleanupModule } from './cleanup/cleanup.module';

function validateEnv(config: Record<string, unknown>) {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Brakujaca zmienna srodowiskowa: ${key}`);
    }
  }
  const jwtSecret = config['JWT_SECRET'] as string;
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET musi miec co najmniej 32 znaki');
  }
  const refreshSecret = config['JWT_REFRESH_SECRET'] as string;
  if (refreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET musi miec co najmniej 32 znaki');
  }
  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ClassesModule,
    StudentsModule,
    ImportModule,
    RiskModule,
    ParentIssuesModule,
    ActionPlansModule,
    DashboardModule,
    ReportsModule,
    SettingsModule,
    AuditModule,
    CleanupModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
