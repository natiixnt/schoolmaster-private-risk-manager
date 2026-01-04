import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { StudentsService } from '../students/students.service';

@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly studentsService: StudentsService,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthRequestUser) {
    return this.classesService.listClasses(user.schoolId);
  }

  @Get('summary')
  listSummary(@CurrentUser() user: AuthRequestUser) {
    return this.classesService.listClassSummaries(user.schoolId);
  }

  @Get(':id/summary')
  getSummary(@CurrentUser() user: AuthRequestUser, @Param('id') id: string) {
    return this.classesService.getClassSummary(user.schoolId, id);
  }

  @Get(':id/students')
  async students(
    @CurrentUser() user: AuthRequestUser,
    @Param('id') id: string,
    @Query('includeRisk') includeRisk?: string,
  ) {
    await this.classesService.getClassOrThrow(user.schoolId, id);
    const withRisk = includeRisk === '1' || includeRisk === 'true';
    return this.studentsService.listStudentsForClass(user.schoolId, id, withRisk);
  }
}
