import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ListReportsDto } from './dto/list-reports.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';

const MAX_PERIOD_DAYS = 366;

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRole.SCHOOL_ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
  UserRole.COUNSELOR,
  UserRole.SUPERADMIN,
)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @Roles(UserRole.DIRECTOR, UserRole.SCHOOL_ADMIN, UserRole.SUPERADMIN)
  async generate(@Body() dto: GenerateReportDto, @CurrentUser() user: AuthRequestUser) {
    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);

    if (Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) {
      throw new BadRequestException('Invalid period dates');
    }

    if (periodStart > periodEnd) {
      throw new BadRequestException('periodStart must be before periodEnd');
    }

    const diffDays = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > MAX_PERIOD_DAYS) {
      throw new BadRequestException('Report period is too long');
    }

    return this.reportsService.generateReport({
      schoolId: user.schoolId,
      type: dto.type,
      periodStart,
      periodEnd,
      userId: user.userId,
    });
  }

  @Get()
  list(@Query() query: ListReportsDto, @CurrentUser() user: AuthRequestUser) {
    return this.reportsService.listReports({
      schoolId: user.schoolId,
      type: query.type,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequestUser,
    @Res() res: Response,
  ) {
    const { report, fullPath } = await this.reportsService.getReportDownload(id, user.schoolId);
    res.setHeader('Content-Type', 'application/pdf');
    return res.download(fullPath, `${report.type}-${report.id}.pdf`);
  }
}
