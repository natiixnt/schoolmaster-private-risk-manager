import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';
import { UpdateSchoolSettingsDto } from './dto/update-school-settings.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRole.SCHOOL_ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
  UserRole.COUNSELOR,
  UserRole.SUPERADMIN,
)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('school')
  getSchoolSettings(@CurrentUser() user: AuthRequestUser) {
    return this.settingsService.getSchoolSettings(user.schoolId);
  }

  @Patch('school')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.DIRECTOR, UserRole.SUPERADMIN)
  updateSchoolSettings(
    @CurrentUser() user: AuthRequestUser,
    @Body() dto: UpdateSchoolSettingsDto,
  ) {
    return this.settingsService.updateSchoolSettings(user.schoolId, dto);
  }
}
