import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskStudentsQueryDto } from './dto/risk-students-query.dto';
import { RecalculateRiskDto } from './dto/recalculate-risk.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthRequestUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';

@Controller('risk')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRole.SCHOOL_ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
  UserRole.COUNSELOR,
)
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('students')
  async list(@Query() query: RiskStudentsQueryDto, @CurrentUser() user: AuthRequestUser) {
    return this.riskService.listRiskStudents({
      schoolId: user.schoolId,
      classId: query.classId,
      level: query.level,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Get('students/:id')
  async getOne(@Param('id') id: string, @CurrentUser() user: AuthRequestUser) {
    return this.riskService.getRiskForStudent(id, user.schoolId);
  }

  @Post('recalculate')
  async recalc(@Body() body: RecalculateRiskDto, @CurrentUser() user: AuthRequestUser) {
    return this.riskService.recalculateRiskForSchool(user.schoolId, body.classId);
  }
}
