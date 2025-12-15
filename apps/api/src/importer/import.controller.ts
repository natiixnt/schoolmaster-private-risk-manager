import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('students')
  @UseInterceptors(FileInterceptor('file'))
  async importStudents(
    @CurrentUser() user: AuthRequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      return {
        totalRows: 0,
        createdStudents: 0,
        createdClasses: 0,
        errors: [{ rowNumber: 0, message: 'No file uploaded' }],
      };
    }

    return this.importService.importStudents(user.schoolId, file.buffer);
  }
}
