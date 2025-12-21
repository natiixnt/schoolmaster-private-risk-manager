import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { ImportModule } from './importer/import.module';
import { RiskModule } from './risk/risk.module';
import { ParentIssuesModule } from './parent-issues/parent-issues.module';
import { ActionPlansModule } from './action-plans/action-plans.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ClassesModule,
    ImportModule,
    RiskModule,
    ParentIssuesModule,
    ActionPlansModule,
    DashboardModule,
    ReportsModule,
    SettingsModule,
  ],
})
export class AppModule {}
