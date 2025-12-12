import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ClassesModule } from '../classes/classes.module';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [ClassesModule, StudentsModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
