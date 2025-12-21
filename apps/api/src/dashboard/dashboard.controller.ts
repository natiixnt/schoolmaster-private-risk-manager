import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRole.SCHOOL_ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
  UserRole.COUNSELOR,
  UserRole.SUPERADMIN,
)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@CurrentUser() user: AuthRequestUser) {
    return this.dashboardService.getOverview(user.schoolId);
  }
}
