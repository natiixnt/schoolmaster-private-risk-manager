import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN, UserRole.DIRECTOR)
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('students')
  @UseInterceptors(FileInterceptor('file'))
  async importStudents(@CurrentUser() user: any, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      return { processed: 0, created: 0, errors: [{ row: 0, error: 'No file uploaded' }] };
    }

    return this.importService.importStudents(user.schoolId, file.buffer);
  }
}
