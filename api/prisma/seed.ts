import { PrismaClient, OrganizationType, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPass = await bcrypt.hash('Admin1234!', 12);
  const userPass = await bcrypt.hash('Pass1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@razumkin.ru' },
    update: {},
    create: {
      email: 'admin@razumkin.ru',
      passwordHash: adminPass,
      name: 'Администратор',
      role: UserRole.admin,
    },
  });

  const business1 = await prisma.user.upsert({
    where: { email: 'akademiya@example.ru' },
    update: {},
    create: {
      email: 'akademiya@example.ru',
      passwordHash: userPass,
      name: 'Наталья Петрова',
      phone: '+7 495 123-45-67',
      role: UserRole.business_owner,
    },
  });

  const business2 = await prisma.user.upsert({
    where: { email: 'solnyshko@example.ru' },
    update: {},
    create: {
      email: 'solnyshko@example.ru',
      passwordHash: userPass,
      name: 'Ирина Смирнова',
      phone: '+7 495 234-56-78',
      role: UserRole.business_owner,
    },
  });

  const business3 = await prisma.user.upsert({
    where: { email: 'sport@example.ru' },
    update: {},
    create: {
      email: 'sport@example.ru',
      passwordHash: userPass,
      name: 'Алексей Козлов',
      phone: '+7 495 345-67-89',
      role: UserRole.business_owner,
    },
  });

  const parent1 = await prisma.user.upsert({
    where: { email: 'parent@example.ru' },
    update: {},
    create: {
      email: 'parent@example.ru',
      passwordHash: userPass,
      name: 'Мария Иванова',
      phone: '+7 916 111-22-33',
      role: UserRole.parent,
    },
  });

  const org1 = await prisma.organization.upsert({
    where: { id: 'seed-org-1' },
    update: {},
    create: {
      id: 'seed-org-1',
      ownerId: business1.id,
      name: 'Академия Знаний',
      description:
        'Ведущий образовательный центр для детей от 3 до 16 лет. Мы предлагаем программы по математике, русскому языку, иностранным языкам и подготовке к школе. Наши педагоги — опытные специалисты с многолетним стажем. Занятия проводятся в малых группах для максимальной эффективности.',
      type: OrganizationType.center,
      address: 'ул. Ленина, 42, офис 301',
      city: 'Москва',
      phone: '+7 495 123-45-67',
      email: 'info@akademiya.ru',
      isVerified: true,
      isActive: true,
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { id: 'seed-org-2' },
    update: {},
    create: {
      id: 'seed-org-2',
      ownerId: business2.id,
      name: 'Детский сад «Солнышко»',
      description:
        'Частный детский сад с уютной атмосферой и индивидуальным подходом к каждому ребёнку. Работаем с детьми от 1.5 до 7 лет. В нашем саду: развивающие занятия, иностранные языки, музыка, спорт и вкусное домашнее питание. Принимаем детей по ИП на возмездной основе.',
      type: OrganizationType.kindergarten,
      address: 'Проспект Мира, 15',
      city: 'Москва',
      phone: '+7 495 234-56-78',
      email: 'solnyshko@mail.ru',
      isVerified: true,
      isActive: true,
    },
  });

  const org3 = await prisma.organization.upsert({
    where: { id: 'seed-org-3' },
    update: {},
    create: {
      id: 'seed-org-3',
      ownerId: business3.id,
      name: 'Спортивная школа «Чемпион»',
      description:
        'Профессиональная спортивная школа для детей от 4 лет. Секции: плавание, гимнастика, футбол, теннис, боевые искусства. Опытные тренеры, современный спортивный комплекс. Гибкое расписание, возможность совмещать несколько секций.',
      type: OrganizationType.sports_club,
      address: 'ул. Спортивная, 8',
      city: 'Москва',
      phone: '+7 495 345-67-89',
      email: 'champion@sport.ru',
      isVerified: true,
      isActive: true,
    },
  });

  const org4 = await prisma.organization.upsert({
    where: { id: 'seed-org-4' },
    update: {},
    create: {
      id: 'seed-org-4',
      ownerId: business1.id,
      name: 'Языковой центр «Полиглот»',
      description:
        'Центр иностранных языков для детей и подростков. Английский, немецкий, китайский, испанский. Методика коммуникативного обучения, носители языка, подготовка к международным экзаменам. Группы по 6-8 человек.',
      type: OrganizationType.language,
      address: 'Тверская ул., 22',
      city: 'Москва',
      phone: '+7 495 456-78-90',
      email: 'info@polyglot.ru',
      isVerified: false,
      isActive: true,
    },
  });

  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      {
        organizationId: org1.id,
        nameRu: 'Подготовка к школе',
        descriptionRu: 'Комплексная подготовка детей 5-7 лет к школьному обучению: чтение, счёт, письмо, развитие речи.',
        priceFrom: 4500,
        priceTo: 6000,
        ageFrom: 5,
        ageTo: 7,
        scheduleInfo: 'Пн, Ср, Пт — 9:00–10:30',
      },
      {
        organizationId: org1.id,
        nameRu: 'Математика и логика',
        descriptionRu: 'Углублённое изучение математики, развитие логического мышления и навыков решения нестандартных задач.',
        priceFrom: 5500,
        priceTo: 8000,
        ageFrom: 7,
        ageTo: 14,
        scheduleInfo: 'Вт, Чт — 15:00–16:30',
      },
      {
        organizationId: org1.id,
        nameRu: 'Английский язык',
        descriptionRu: 'Английский для детей с нуля и любого уровня. Коммуникативная методика, погружение в язык через игру.',
        priceFrom: 5000,
        priceTo: 7500,
        ageFrom: 4,
        ageTo: 16,
        scheduleInfo: 'Пн, Ср, Пт — 11:00–12:00',
      },
      {
        organizationId: org2.id,
        nameRu: 'Ясельная группа',
        descriptionRu: 'Для малышей 1.5–3 лет. Уход, развивающие занятия, социализация в игровой форме.',
        priceFrom: 35000,
        priceTo: 45000,
        ageFrom: 2,
        ageTo: 3,
        scheduleInfo: '8:00–19:00, пн-пт',
      },
      {
        organizationId: org2.id,
        nameRu: 'Дошкольная группа',
        descriptionRu: 'Для детей 3–7 лет. Полный день, питание, дневной сон, развивающие занятия, прогулки.',
        priceFrom: 40000,
        priceTo: 55000,
        ageFrom: 3,
        ageTo: 7,
        scheduleInfo: '7:30–19:30, пн-пт',
      },
      {
        organizationId: org3.id,
        nameRu: 'Плавание',
        descriptionRu: 'Обучение плаванию с нуля, групповые и индивидуальные тренировки. 25-метровый бассейн.',
        priceFrom: 3500,
        priceTo: 6000,
        ageFrom: 4,
        ageTo: 16,
        scheduleInfo: 'Ежедневно, несколько групп',
      },
      {
        organizationId: org3.id,
        nameRu: 'Футбол',
        descriptionRu: 'Футбольная секция для мальчиков и девочек. Тренировки на открытом поле и в зале.',
        priceFrom: 3000,
        priceTo: 5000,
        ageFrom: 5,
        ageTo: 16,
        scheduleInfo: 'Вт, Чт, Сб — 15:00 и 17:00',
      },
    ],
  });

  await prisma.child.upsert({
    where: { id: 'seed-child-1' },
    update: {},
    create: {
      id: 'seed-child-1',
      parentId: parent1.id,
      name: 'Анна',
      birthDate: new Date('2017-05-15'),
      gender: 'female',
      interests: ['рисование', 'танцы', 'математика'],
    },
  });

  await prisma.review.createMany({
    skipDuplicates: true,
    data: [
      {
        authorId: parent1.id,
        organizationId: org1.id,
        rating: 5,
        body: 'Прекрасный центр! Дочка занимается уже год, результаты отличные. Педагоги внимательные и профессиональные.',
        isModerated: true,
      },
      {
        authorId: parent1.id,
        organizationId: org2.id,
        rating: 5,
        body: 'Замечательный садик. Уютная атмосфера, воспитатели очень добрые. Ребёнок идёт туда с удовольствием.',
        isModerated: true,
      },
      {
        authorId: parent1.id,
        organizationId: org3.id,
        rating: 4,
        body: 'Хорошая спортивная школа. Тренеры знающие, дисциплина на высоком уровне. Единственный минус — парковка.',
        isModerated: true,
      },
    ],
  });

  console.log('✅ Seed completed successfully');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Admin:    admin@razumkin.ru / Admin1234!');
  console.log('  Business: akademiya@example.ru / Pass1234!');
  console.log('  Parent:   parent@example.ru / Pass1234!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
