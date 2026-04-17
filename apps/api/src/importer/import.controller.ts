import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthRequestUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@schoolmaster/core';

const CSV_MIME_TYPES = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN, UserRole.DIRECTOR, UserRole.SUPERADMIN)
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('students')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!CSV_MIME_TYPES.includes(file.mimetype)) {
          cb(new BadRequestException('Dozwolone sa tylko pliki CSV'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async importStudents(
    @CurrentUser() user: AuthRequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      return {
        totalRows: 0,
        createdStudents: 0,
        createdClasses: 0,
        errors: [{ rowNumber: 0, message: 'Nie przeslano pliku' }],
      };
    }

    return this.importService.importStudents(user.schoolId, file.buffer);
  }
}
