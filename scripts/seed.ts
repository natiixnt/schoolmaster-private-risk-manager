import {
  UserRole,
  UserStatus,
  StudentStatus,
  AttendanceStatus,
  BehaviorSeverity,
  BehaviorType,
  GradeType,
  ParentIssueCategory,
  ParentIssuePriority,
  ParentIssueStatus,
  StudentActionItemStatus,
  StudentActionPlanStatus,
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

  const existingAssessments = await prisma.assessment.count({
    where: { student: { schoolId: school.id } },
  });
  const existingAttendance = await prisma.attendance.count({
    where: { student: { schoolId: school.id } },
  });
  const existingBehavior = await prisma.behaviorEvent.count({
    where: { student: { schoolId: school.id } },
  });

  const seedAssessments = existingAssessments === 0;
  const seedAttendance = existingAttendance === 0;
  const seedBehavior = existingBehavior === 0;

  if (seedAssessments || seedAttendance || seedBehavior) {
    for (const student of students) {
      const classId = student.classId;
      if (seedAssessments) {
        const assessmentsData = Array.from({ length: 12 }).map(() => ({
          studentId: student.id,
          classId,
          subject: 'Math',
          gradeValue: (Math.random() * 3 + 2).toFixed(2),
          gradeType: GradeType.PARTIAL,
          date: randomDateWithin(150),
        }));
        await prisma.assessment.createMany({ data: assessmentsData });
      }

      if (seedAttendance) {
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
      }

      if (seedBehavior) {
        const behaviorData = Array.from({ length: 5 }).map(() => ({
          studentId: student.id,
          classId,
          type: Math.random() > 0.7 ? BehaviorType.PRAISE : BehaviorType.INCIDENT,
          severity:
            Math.random() > 0.8
              ? BehaviorSeverity.HIGH
              : Math.random() > 0.5
                ? BehaviorSeverity.MEDIUM
                : BehaviorSeverity.LOW,
          description: 'Seeded event',
          createdByUserId: adminUser.id,
          date: randomDateWithin(120),
        }));
        await prisma.behaviorEvent.createMany({ data: behaviorData });
      }
    }
  }

  const existingRiskScores = await prisma.riskScore.count({
    where: { student: { schoolId: school.id } },
  });
  if (existingRiskScores === 0 || seedAssessments || seedAttendance || seedBehavior) {
    const riskService = new RiskService(prisma);
    await riskService.recalculateRiskForSchool(school.id);
  }

  const existingIssues = await prisma.parentIssue.count({ where: { schoolId: school.id } });
  if (!existingIssues) {
    const issueStatuses = [
      ParentIssueStatus.NEW,
      ParentIssueStatus.IN_PROGRESS,
      ParentIssueStatus.RESOLVED,
    ];
    const issuePriorities = [
      ParentIssuePriority.LOW,
      ParentIssuePriority.MEDIUM,
      ParentIssuePriority.HIGH,
    ];
    const issueCategories = [
      ParentIssueCategory.COMPLAINT,
      ParentIssueCategory.QUESTION,
      ParentIssueCategory.SUGGESTION,
      ParentIssueCategory.PRAISE,
    ];

    const issueStudents = students.slice(0, Math.min(6, students.length));
    for (let i = 0; i < issueStudents.length; i += 1) {
      const student = issueStudents[i];
      const status = issueStatuses[i % issueStatuses.length];
      const priority = issuePriorities[i % issuePriorities.length];
      const category = issueCategories[i % issueCategories.length];
      const isGeneral = i === issueStudents.length - 1;

      const issue = await prisma.parentIssue.create({
        data: {
          schoolId: school.id,
          studentId: isGeneral ? null : student.id,
          title: isGeneral
            ? 'General parent concern'
            : `${category.toLowerCase()} about ${student.firstName}`,
          description: isGeneral
            ? 'Seeded general issue without a specific student.'
            : `Seeded ${category.toLowerCase()} for ${student.firstName} ${student.lastName}.`,
          category,
          priority,
          status,
          assignedToUserId: i % 2 === 0 ? adminUser.id : null,
          closedAt:
            status === ParentIssueStatus.RESOLVED ? randomDateWithin(30) : null,
        },
      });

      const commentsCount = 1 + (i % 3);
      for (let c = 0; c < commentsCount; c += 1) {
        await prisma.parentIssueComment.create({
          data: {
            issueId: issue.id,
            authorUserId: adminUser.id,
            comment: `Seeded comment ${c + 1} for ${issue.title}.`,
          },
        });
      }
    }
  }

  const existingPlans = await prisma.studentActionPlan.count({
    where: { student: { schoolId: school.id } },
  });
  if (!existingPlans) {
    const planStudents = students.slice(0, Math.min(3, students.length));
    const planGoals = [
      'Improve attendance',
      'Strengthen math fundamentals',
    ];
    const planStatuses = [
      StudentActionPlanStatus.OPEN,
      StudentActionPlanStatus.IN_PROGRESS,
      StudentActionPlanStatus.DONE,
    ];
    const itemStatuses = [
      StudentActionItemStatus.TODO,
      StudentActionItemStatus.IN_PROGRESS,
      StudentActionItemStatus.DONE,
    ];

    for (let i = 0; i < planStudents.length; i += 1) {
      const student = planStudents[i];
      for (let g = 0; g < planGoals.length; g += 1) {
        const plan = await prisma.studentActionPlan.create({
          data: {
            studentId: student.id,
            createdByUserId: adminUser.id,
            goal: `${planGoals[g]} for ${student.firstName}`,
            status: planStatuses[(i + g) % planStatuses.length],
          },
        });

        const items = Array.from({ length: 3 }).map((_, idx) => ({
          actionPlanId: plan.id,
          description: `Action item ${idx + 1} for ${student.firstName}`,
          ownerUserId: adminUser.id,
          status: itemStatuses[(idx + i + g) % itemStatuses.length],
          dueDate: Math.random() > 0.4 ? randomDateWithin(30) : null,
        }));
        await prisma.studentActionItem.createMany({ data: items });
      }
    }
  }

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
