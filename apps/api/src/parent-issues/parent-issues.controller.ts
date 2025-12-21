import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ParentIssuesService } from './parent-issues.service';
import { ListParentIssuesDto } from './dto/list-parent-issues.dto';
import { CreateParentIssueDto } from './dto/create-parent-issue.dto';
import { UpdateParentIssueDto } from './dto/update-parent-issue.dto';
import { CreateParentIssueCommentDto } from './dto/create-parent-issue-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@schoolmaster/core';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRole.SCHOOL_ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
  UserRole.COUNSELOR,
  UserRole.SUPERADMIN,
)
@Controller('parent-issues')
export class ParentIssuesController {
  constructor(private readonly service: ParentIssuesService) {}

  @Get()
  list(@Query() query: ListParentIssuesDto, @CurrentUser() user: AuthRequestUser) {
    return this.service.listIssues({
      schoolId: user.schoolId,
      status: query.status,
      priority: query.priority,
      classId: query.classId,
      studentId: query.studentId,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: AuthRequestUser) {
    return this.service.getIssue(id, user.schoolId);
  }

  @Post()
  create(@Body() dto: CreateParentIssueDto, @CurrentUser() user: AuthRequestUser) {
    return this.service.createIssue({
      schoolId: user.schoolId,
      studentId: dto.studentId,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority: dto.priority,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateParentIssueDto,
    @CurrentUser() user: AuthRequestUser,
  ) {
    return this.service.updateIssue(id, user.schoolId, dto);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateParentIssueCommentDto,
    @CurrentUser() user: AuthRequestUser,
  ) {
    return this.service.addComment(id, user.schoolId, user.userId, dto.comment);
  }
}
