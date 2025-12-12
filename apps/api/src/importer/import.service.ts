import { Injectable } from '@nestjs/common';
import { ClassesService } from '../classes/classes.service';
import { StudentsService } from '../students/students.service';
import { parse } from 'csv-parse/sync';

interface CsvRow {
  class_name?: string;
  first_name?: string;
  last_name?: string;
  external_id?: string;
}

@Injectable()
export class ImportService {
  constructor(
    private readonly classesService: ClassesService,
    private readonly studentsService: StudentsService,
  ) {}

  async importStudents(schoolId: string, csvBuffer: Buffer) {
    const records = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[];

    let processed = 0;
    let created = 0;
    const errors: { row: number; error: string }[] = [];
    const classCache = new Map<string, string>();

    for (const record of records) {
      processed += 1;
      const rowNumber = processed;
      const className = record.class_name?.trim();
      const firstName = record.first_name?.trim();
      const lastName = record.last_name?.trim();

      if (!className || !firstName || !lastName) {
        errors.push({ row: rowNumber, error: 'Missing required fields' });
        continue;
      }

      try {
        let classId = classCache.get(className);
        if (!classId) {
          const cls = await this.classesService.getOrCreateByName(schoolId, className);
          classId = cls.id;
          classCache.set(className, classId);
        }

        await this.studentsService.createMany(schoolId, classId, [
          {
            firstName,
            lastName,
            externalId: record.external_id ?? null,
          },
        ]);
        created += 1;
      } catch (error: any) {
        errors.push({ row: rowNumber, error: error?.message ?? 'Unknown error' });
      }
    }

    return { processed, created, errors };
  }
}
