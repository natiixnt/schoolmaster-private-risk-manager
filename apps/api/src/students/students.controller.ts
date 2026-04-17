import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // RODO Art. 17 - prawo do bycia zapomnianym: kaskadowe usunięcie danych ucznia
  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.DIRECTOR, UserRole.SUPERADMIN)
  deleteStudent(@CurrentUser() user: AuthRequestUser, @Param('id') id: string) {
    return this.studentsService.deleteStudent(user.schoolId, id);
  }

  // RODO Art. 20 - prawo do przenośności danych: eksport kompletnych danych ucznia
  @Get(':id/export')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.DIRECTOR, UserRole.SUPERADMIN, UserRole.COUNSELOR)
  exportStudent(@CurrentUser() user: AuthRequestUser, @Param('id') id: string) {
    return this.studentsService.exportStudent(user.schoolId, id);
  }
}
