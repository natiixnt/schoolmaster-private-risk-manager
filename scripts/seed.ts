import { PrismaClient, UserRole, UserStatus, StudentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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
  }

  const password = 'changeme';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
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

  await prisma.student.createMany({
    data: [
      {
        schoolId: school.id,
        classId: classA.id,
        firstName: 'Jan',
        lastName: 'Kowalski',
        status: StudentStatus.ACTIVE,
      },
      {
        schoolId: school.id,
        classId: classA.id,
        firstName: 'Anna',
        lastName: 'Nowak',
        status: StudentStatus.ACTIVE,
      },
    ],
    skipDuplicates: true,
  });

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
