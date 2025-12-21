import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ActionPlansService } from './action-plans.service';
import { CreateActionPlanDto } from './dto/create-action-plan.dto';
import { UpdateActionPlanDto } from './dto/update-action-plan.dto';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';
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
@Controller()
export class ActionPlansController {
  constructor(private readonly actionPlansService: ActionPlansService) {}

  @Get('students/:studentId/action-plans')
  listForStudent(@Param('studentId') studentId: string, @CurrentUser() user: AuthRequestUser) {
    return this.actionPlansService.listForStudent(studentId, user.schoolId);
  }

  @Get('action-plans/:id')
  getOne(@Param('id') id: string, @CurrentUser() user: AuthRequestUser) {
    return this.actionPlansService.getPlan(id, user.schoolId);
  }

  @Post('students/:studentId/action-plans')
  createPlan(
    @Param('studentId') studentId: string,
    @Body() dto: CreateActionPlanDto,
    @CurrentUser() user: AuthRequestUser,
  ) {
    return this.actionPlansService.createPlan(studentId, user.schoolId, user.userId, dto);
  }

  @Patch('action-plans/:id')
  updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdateActionPlanDto,
    @CurrentUser() user: AuthRequestUser,
  ) {
    return this.actionPlansService.updatePlan(id, user.schoolId, dto);
  }

  @Post('action-plans/:id/items')
  addItem(
    @Param('id') id: string,
    @Body() dto: CreateActionItemDto,
    @CurrentUser() user: AuthRequestUser,
  ) {
    return this.actionPlansService.addItem(id, user.schoolId, user.userId, dto);
  }

  @Patch('action-plan-items/:id')
  updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateActionItemDto,
    @CurrentUser() user: AuthRequestUser,
  ) {
    return this.actionPlansService.updateItem(id, user.schoolId, dto);
  }
}
