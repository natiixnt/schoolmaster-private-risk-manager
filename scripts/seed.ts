import {
  PrismaClient,
  UserRole,
  UserStatus,
  StudentStatus,
  AttendanceStatus,
  BehaviorSeverity,
  BehaviorType,
  GradeType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RiskService } from '../apps/api/src/risk/risk.service';
import { PrismaService } from '../apps/api/src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  await prisma.$connect();
  let school = await prisma.school.findFirst({ where: { name: 'Demo School' } });
  if (!school) {
    school = await prisma.school.create({
      data: {
        name: 'Demo School',
        type: 'PUBLIC',
        city: 'Warsaw',
        address: 'Test Street 1',
      },
    });
  } else if (!school.type) {
    school = await prisma.school.update({
      where: { id: school.id },
      data: { type: 'PUBLIC' },
    });
  }

  const password = 'changeme';
  const hashed = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@schoolmaster.test' },
    update: {
      hashedPassword: hashed,
      schoolId: school.id,
      role: UserRole.SCHOOL_ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'admin@schoolmaster.test',
      hashedPassword: hashed,
      schoolId: school.id,
      role: UserRole.SCHOOL_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const classA =
    (await prisma.class.findFirst({ where: { schoolId: school.id, name: '7A' } })) ||
    (await prisma.class.create({
      data: {
        schoolId: school.id,
        name: '7A',
        yearLevel: 7,
      },
    }));

  const classB =
    (await prisma.class.findFirst({ where: { schoolId: school.id, name: '7B' } })) ||
    (await prisma.class.create({
      data: {
        schoolId: school.id,
        name: '7B',
        yearLevel: 7,
      },
    }));

  const namesA = [
    ['Jan', 'Kowalski'],
    ['Anna', 'Nowak'],
    ['Piotr', 'Zielinski'],
    ['Kasia', 'Wisniewska'],
    ['Ola', 'Krawczyk'],
    ['Marek', 'Lewandowski'],
    ['Ewa', 'Kamińska'],
    ['Tomasz', 'Wojcik'],
    ['Julia', 'Kaczmarek'],
    ['Karol', 'Mazur'],
  ];
  const namesB = [
    ['Paweł', 'Kubiak'],
    ['Magda', 'Pawlowska'],
    ['Rafal', 'Piotrowski'],
    ['Natalia', 'Sikora'],
    ['Mateusz', 'Kozlowski'],
    ['Agata', 'Zajac'],
    ['Lena', 'Król'],
    ['Szymon', 'Wesolowski'],
    ['Marta', 'Jasińska'],
    ['Bartek', 'Malinowski'],
  ];

  const createStudents = async (classId: string, list: string[][]) => {
    await prisma.student.createMany({
      data: list.map(([firstName, lastName]) => ({
        schoolId: school.id,
        classId,
        firstName,
        lastName,
        status: StudentStatus.ACTIVE,
      })),
      skipDuplicates: true,
    });
  };

  await createStudents(classA.id, namesA);
  await createStudents(classB.id, namesB);

  const students = await prisma.student.findMany({ where: { schoolId: school.id } });

  const randomDateWithin = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * days));
    return d;
  };

  for (const student of students) {
    const classId = student.classId;
    // Assessments
    const assessmentsData = Array.from({ length: 12 }).map(() => ({
      studentId: student.id,
      classId,
      subject: 'Math',
      gradeValue: (Math.random() * 3 + 2).toFixed(2),
      gradeType: GradeType.PARTIAL,
      date: randomDateWithin(150),
    }));
    await prisma.assessment.createMany({ data: assessmentsData });

    // Attendance
    const attendanceStatuses = [
      AttendanceStatus.PRESENT,
      AttendanceStatus.PRESENT,
      AttendanceStatus.ABSENT,
      AttendanceStatus.LATE,
      AttendanceStatus.JUSTIFIED_ABSENT,
    ];
    const attendanceData = Array.from({ length: 40 }).map(() => ({
      studentId: student.id,
      classId,
      date: randomDateWithin(120),
      lessonNo: Math.ceil(Math.random() * 6),
      status: attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)],
    }));
    await prisma.attendance.createMany({ data: attendanceData });

    // Behavior events
    const behaviorData = Array.from({ length: 5 }).map(() => ({
      studentId: student.id,
      classId,
      type: Math.random() > 0.7 ? BehaviorType.PRAISE : BehaviorType.INCIDENT,
      severity:
        Math.random() > 0.8 ? BehaviorSeverity.HIGH : Math.random() > 0.5 ? BehaviorSeverity.MEDIUM : BehaviorSeverity.LOW,
      description: 'Seeded event',
      createdByUserId: adminUser.id,
      date: randomDateWithin(120),
    }));
    await prisma.behaviorEvent.createMany({ data: behaviorData });
  }

  const riskService = new RiskService(prisma);
  await riskService.recalculateRiskForSchool(school.id);

  // eslint-disable-next-line no-console
  console.log('Seed completed. Admin user: admin@schoolmaster.test / changeme');
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
