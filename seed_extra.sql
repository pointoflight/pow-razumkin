-- Extra seed data: educators, more orgs, parents with kids, reviews, leads
DO $$
DECLARE
  h TEXT := '$2a$12$KmH2qWrnaJlja4eZ4tNQyuDxYi6Yl318kI5YJQCkDK5e4e0aROZj2';

  biz4 TEXT; biz5 TEXT; biz6 TEXT; biz7 TEXT; biz8 TEXT;
  edu1 TEXT; edu2 TEXT; edu3 TEXT; edu4 TEXT; edu5 TEXT; edu6 TEXT;
  par2 TEXT; par3 TEXT; par4 TEXT; par5 TEXT; par6 TEXT;
  ch2 TEXT; ch3 TEXT; ch4 TEXT; ch5 TEXT; ch6 TEXT; ch7 TEXT; ch8 TEXT;

BEGIN

-- ============================================================
-- BUSINESS OWNERS
-- ============================================================
INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'garmoniya@example.ru', h, 'Галина Фёдорова', '+7 812 111-22-33', 'business_owner', now() - interval '8 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO biz4 FROM users WHERE email = 'garmoniya@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'palitra@example.ru', h, 'Роман Захаров', '+7 495 555-11-22', 'business_owner', now() - interval '6 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO biz5 FROM users WHERE email = 'palitra@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'umnik@example.ru', h, 'Светлана Беляева', '+7 495 666-33-44', 'business_owner', now() - interval '5 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO biz6 FROM users WHERE email = 'umnik@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'gorizont@example.ru', h, 'Василий Морозов', '+7 343 777-55-66', 'business_owner', now() - interval '10 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO biz7 FROM users WHERE email = 'gorizont@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'ritm@example.ru', h, 'Юлия Новикова', '+7 495 888-77-99', 'business_owner', now() - interval '4 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO biz8 FROM users WHERE email = 'ritm@example.ru';

-- ============================================================
-- EDUCATORS
-- ============================================================
INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'sokolova@example.ru', h, 'Анна Соколова', '+7 916 200-10-11', 'educator', now() - interval '7 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu1 FROM users WHERE email = 'sokolova@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'orlov@example.ru', h, 'Дмитрий Орлов', '+7 916 300-20-22', 'educator', now() - interval '9 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu2 FROM users WHERE email = 'orlov@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'gerasimova@example.ru', h, 'Елена Герасимова', '+7 921 400-30-33', 'educator', now() - interval '11 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu3 FROM users WHERE email = 'gerasimova@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'popov.m@example.ru', h, 'Михаил Попов', '+7 916 500-40-44', 'educator', now() - interval '3 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu4 FROM users WHERE email = 'popov.m@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'belova@example.ru', h, 'Ольга Белова', '+7 916 600-50-55', 'educator', now() - interval '13 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu5 FROM users WHERE email = 'belova@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'lisitsyn@example.ru', h, 'Павел Лисицын', '+7 343 700-60-66', 'educator', now() - interval '6 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu6 FROM users WHERE email = 'lisitsyn@example.ru';

-- Educator profiles
INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu1,
  'Репетитор по математике и физике. Готовлю школьников к ОГЭ и ЕГЭ. Более 200 успешных учеников. Индивидуальный подход, понятные объяснения, гарантированный результат. Занятия онлайн и очно.',
  ARRAY['Математика', 'Физика', 'ОГЭ', 'ЕГЭ'], 10, 'Москва', true, now() - interval '7 months', now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu2,
  'Преподаватель английского языка. Работал в Лондоне и Нью-Йорке. Подготовка к IELTS, TOEFL, Cambridge экзаменам. Разговорный клуб для детей и взрослых. Специализируюсь на детях от 6 лет.',
  ARRAY['Английский язык', 'IELTS', 'TOEFL', 'Разговорная практика'], 7, 'Москва', true, now() - interval '9 months', now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu3,
  'Художник и педагог. Член Союза художников России. Преподаю живопись, рисунок, акварель детям от 5 лет. Готовлю к поступлению в художественные школы и колледжи.',
  ARRAY['Рисование', 'Живопись', 'Акварель', 'Скульптура'], 12, 'Санкт-Петербург', true, now() - interval '11 months', now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu4,
  'Разработчик и педагог в сфере IT. Обучаю детей программированию на Python, Scratch, создание игр и веб-сайтов. Занятия в игровой форме, проектный подход. Группы от 5 лет.',
  ARRAY['Программирование', 'Python', 'Scratch', 'Робототехника', 'Web-разработка'], 5, 'Москва', true, now() - interval '3 months', now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu5,
  'Преподаватель фортепиано, окончила Московскую консерваторию. Обучаю детей от 4 лет. Классика, джаз, эстрадная музыка. Подготовка к музыкальным конкурсам. Выезжаю на дом по Москве.',
  ARRAY['Фортепиано', 'Сольфеджио', 'Музыкальная теория', 'Джаз'], 15, 'Москва', true, now() - interval '13 months', now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu6,
  'Мастер спорта по плаванию, тренер высшей категории. Обучаю плаванию детей с 3 лет. Тренировки для любого уровня подготовки: от новичков до спортсменов. Персональный тренер по фитнесу.',
  ARRAY['Плавание', 'Фитнес', 'Аквааэробика', 'ОФП'], 8, 'Екатеринбург', true, now() - interval '6 months', now())
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- PARENTS WITH CHILDREN
-- ============================================================
INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'kuznetsov@example.ru', h, 'Сергей Кузнецов', '+7 916 111-00-01', 'parent', now() - interval '5 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO par2 FROM users WHERE email = 'kuznetsov@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'lebedeva@example.ru', h, 'Татьяна Лебедева', '+7 903 222-00-02', 'parent', now() - interval '4 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO par3 FROM users WHERE email = 'lebedeva@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'nikolaev@example.ru', h, 'Андрей Николаев', '+7 925 333-00-03', 'parent', now() - interval '3 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO par4 FROM users WHERE email = 'nikolaev@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'fedorova.yu@example.ru', h, 'Юлия Федорова', '+7 916 444-00-04', 'parent', now() - interval '6 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO par5 FROM users WHERE email = 'fedorova.yu@example.ru';

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'alekseev@example.ru', h, 'Виктор Алексеев', '+7 967 555-00-05', 'parent', now() - interval '2 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO par6 FROM users WHERE email = 'alekseev@example.ru';

-- Children
INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par2, 'Илья', '2016-03-12', 'male', ARRAY['футбол','программирование','лего'], now() - interval '5 months', now());
SELECT id INTO ch2 FROM children WHERE parent_id = par2 AND name = 'Илья';

INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par2, 'Соня', '2019-09-25', 'female', ARRAY['рисование','танцы','лепка'], now() - interval '5 months', now());
SELECT id INTO ch3 FROM children WHERE parent_id = par2 AND name = 'Соня';

INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par3, 'Артём', '2015-11-07', 'male', ARRAY['плавание','математика','шахматы'], now() - interval '4 months', now());
SELECT id INTO ch4 FROM children WHERE parent_id = par3 AND name = 'Артём';

INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par4, 'Полина', '2018-06-19', 'female', ARRAY['музыка','рисование','балет'], now() - interval '3 months', now());
SELECT id INTO ch5 FROM children WHERE parent_id = par4 AND name = 'Полина';

INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par5, 'Максим', '2017-02-28', 'male', ARRAY['футбол','роботы','английский'], now() - interval '6 months', now());
SELECT id INTO ch6 FROM children WHERE parent_id = par5 AND name = 'Максим';

INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par5, 'Кирилл', '2020-07-14', 'male', ARRAY['машинки','конструктор'], now() - interval '6 months', now());
SELECT id INTO ch7 FROM children WHERE parent_id = par5 AND name = 'Кирилл';

INSERT INTO children (id, parent_id, name, birth_date, gender, interests, created_at, updated_at)
VALUES (gen_random_uuid()::text, par6, 'Вика', '2016-12-01', 'female', ARRAY['танцы','гимнастика','пение'], now() - interval '2 months', now());
SELECT id INTO ch8 FROM children WHERE parent_id = par6 AND name = 'Вика';

-- ============================================================
-- MORE ORGANIZATIONS
-- id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at
-- ============================================================
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('seed-org-5', biz4,
  'Музыкальная школа «Гармония»',
  'Профессиональное музыкальное образование для детей от 4 лет. Классы фортепиано, скрипки, виолончели, гитары, ударных. Наши выпускники поступают в ведущие консерватории страны. Камерный оркестр, хор, ансамбли. Уютные классы с хорошей акустикой.',
  'music', 'Невский проспект, 87', 'Санкт-Петербург', '+7 812 111-22-33', 'garmoniya@music.ru',
  true, true, now() - interval '8 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('seed-org-6', biz5,
  'Арт-студия «Палитра»',
  'Творческое пространство для юных художников. Рисунок и живопись, акварель, масло, пастель, цифровое искусство. Занятия для детей от 4 до 17 лет. Регулярные выставки работ. Подготовка к поступлению в художественные школы. Группы по 6–8 человек.',
  'art', 'ул. Арбат, 33', 'Москва', '+7 495 555-11-22', 'info@palitra-art.ru',
  true, true, now() - interval '6 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('seed-org-7', biz6,
  'Репетиторский центр «Умник»',
  'Помощь школьникам с учёбой любого уровня сложности. Подготовка к ОГЭ и ЕГЭ по всем предметам. Ликвидация пробелов в знаниях, углублённое изучение. Онлайн и офлайн форматы. Гарантируем повышение оценки. Первое занятие бесплатно.',
  'tutoring', 'Ленинский проспект, 54, офис 210', 'Москва', '+7 495 666-33-44', 'info@umnik-center.ru',
  true, true, now() - interval '5 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('seed-org-8', biz7,
  'Частная школа «Горизонт»',
  'Современное образование для детей 6–18 лет. Малые классы до 15 человек, углублённая программа, проектное обучение. Собственная IT-лаборатория, спортзал, столовая с домашней едой. Два иностранных языка с первого класса. Дополнительные секции и кружки.',
  'school', 'ул. Малышева, 101', 'Екатеринбург', '+7 343 777-55-66', 'school@gorizont.ru',
  true, true, now() - interval '10 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('seed-org-9', biz8,
  'Танцевальная студия «Ритм»',
  'Профессиональное обучение танцам для детей от 3 лет и взрослых. Направления: хип-хоп, contemporary, бальные танцы, народный танец, джаз-модерн. Опытные хореографы, большой зал с зеркалами и правильным покрытием. Участвуем в городских и всероссийских конкурсах.',
  'other', 'ул. Садовая, 19', 'Москва', '+7 495 888-77-99', 'info@ritm-dance.ru',
  false, true, now() - interval '4 months', now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SERVICES for new orgs
-- ============================================================
INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at)
VALUES
  (gen_random_uuid()::text, 'seed-org-5', 'Фортепиано', 'Индивидуальные уроки фортепиано. Классический репертуар, джаз, нотная грамота.', 4000, 7000, 4, 18, 'По согласованию с преподавателем', true, now() - interval '8 months'),
  (gen_random_uuid()::text, 'seed-org-5', 'Скрипка', 'Обучение игре на скрипке с нуля. Классическая школа, участие в ансамбле.', 4500, 7500, 5, 16, 'Пн, Ср, Пт — индивидуально', true, now() - interval '8 months'),
  (gen_random_uuid()::text, 'seed-org-5', 'Гитара', 'Акустическая и электрогитара. Классика, рок, бой и перебор. Можно с нуля.', 3500, 6000, 6, 18, 'Вт, Чт, Сб — по расписанию', true, now() - interval '7 months'),
  (gen_random_uuid()::text, 'seed-org-5', 'Хор', 'Детский хор. Развитие слуха, голоса, сценической уверенности.', 2500, 3500, 5, 14, 'Пн, Чт — 17:00', true, now() - interval '6 months'),

  (gen_random_uuid()::text, 'seed-org-6', 'Рисунок и живопись', 'Основы академического рисунка и живописи. Карандаш, уголь, масло, акрил.', 4000, 6500, 5, 17, 'Вт, Чт, Сб — 10:00–12:30', true, now() - interval '6 months'),
  (gen_random_uuid()::text, 'seed-org-6', 'Акварель для детей', 'Лёгкое и радостное знакомство с акварелью. Рисуем природу, персонажей.', 3000, 4500, 4, 12, 'Сб, Вс — 10:00–11:30', true, now() - interval '5 months'),
  (gen_random_uuid()::text, 'seed-org-6', 'Цифровое искусство', 'Рисование на графическом планшете. Procreate, Photoshop. Для подростков.', 4500, 7000, 10, 17, 'Пн, Ср — 16:00–17:30', true, now() - interval '4 months'),

  (gen_random_uuid()::text, 'seed-org-7', 'Репетитор по математике', 'Подготовка к ОГЭ/ЕГЭ, ликвидация пробелов, олимпиадная математика.', 1500, 3000, 10, 18, 'По расписанию репетитора', true, now() - interval '5 months'),
  (gen_random_uuid()::text, 'seed-org-7', 'Репетитор по английскому', 'Разговорный английский, грамматика, подготовка к ЕГЭ.', 1500, 2800, 8, 18, 'По согласованию', true, now() - interval '5 months'),
  (gen_random_uuid()::text, 'seed-org-7', 'Помощь с домашними заданиями', 'Ежедневная помощь с ДЗ по всем предметам. Онлайн-сессии после школы.', 800, 1500, 6, 16, 'Пн–Пт, 13:00–19:00', true, now() - interval '4 months'),

  (gen_random_uuid()::text, 'seed-org-8', 'Начальная школа (1–4 класс)', 'Полный день. Малые классы 12–15 человек. Развивающая программа + два языка.', 45000, 65000, 6, 10, 'Пн–Пт, 8:00–17:00', true, now() - interval '10 months'),
  (gen_random_uuid()::text, 'seed-org-8', 'Средняя школа (5–9 класс)', 'Углублённый курс. IT-лаборатория, проектная деятельность. Подготовка к ОГЭ.', 50000, 70000, 10, 15, 'Пн–Пт, 8:00–17:00', true, now() - interval '10 months'),
  (gen_random_uuid()::text, 'seed-org-8', 'Группа продлённого дня', 'Помощь с ДЗ, кружки, прогулки, полдник. Для учеников школы «Горизонт».', 15000, 20000, 6, 15, 'Пн–Пт, 13:00–19:00', true, now() - interval '9 months'),

  (gen_random_uuid()::text, 'seed-org-9', 'Хип-хоп (дети)', 'Танцы в стиле хип-хоп для детей 4–12 лет. Ритм, пластика, командный дух.', 3000, 5000, 4, 12, 'Вт, Чт — 16:30; Сб — 11:00', true, now() - interval '4 months'),
  (gen_random_uuid()::text, 'seed-org-9', 'Бальные танцы', 'Латиноамериканская и европейская программа. Участие в городских соревнованиях.', 3500, 6000, 5, 16, 'Пн, Ср, Пт — 17:00', true, now() - interval '4 months'),
  (gen_random_uuid()::text, 'seed-org-9', 'Contemporary', 'Современная хореография, импровизация, пластика тела. Для детей от 8 лет.', 3500, 5500, 8, 18, 'Вт, Пт — 18:00', true, now() - interval '3 months');

-- ============================================================
-- REVIEWS for organizations
-- ============================================================
INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-5', 5,
  'Потрясающая музыкальная школа! Дочка занимается фортепиано уже год, педагог очень терпеливый и талантливый. Атмосфера творческая и вдохновляющая.',
  true, now() - interval '2 months'
FROM users u WHERE u.email = 'parent@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-5', 4,
  'Хорошая школа. Сын занимается на гитаре, доволен. Единственное пожелание — больше ансамблевой игры.',
  true, now() - interval '1 month'
FROM users u WHERE u.email = 'kuznetsov@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-6', 5,
  'Прекрасная арт-студия. Ребёнок открыл в себе художника — теперь рисует всё свободное время. Педагоги умеют найти подход к каждому.',
  true, now() - interval '3 months'
FROM users u WHERE u.email = 'kuznetsov@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-6', 5,
  'Записали дочку на акварель — результат превзошёл ожидания! Очень тёплая обстановка, дети рисуют с удовольствием.',
  true, now() - interval '6 weeks'
FROM users u WHERE u.email = 'nikolaev@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-7', 4,
  'Хороший репетиторский центр. Сын подтянул математику за два месяца. Педагоги объясняют понятно, есть онлайн занятия — удобно.',
  true, now() - interval '1 month'
FROM users u WHERE u.email = 'lebedeva@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-8', 5,
  'Лучшая частная школа в Екатеринбурге! Классы маленькие, к каждому ребёнку — индивидуальный подход. Дочка обожает учиться.',
  true, now() - interval '2 months'
FROM users u WHERE u.email = 'nikolaev@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-9', 5,
  'Студия «Ритм» — просто огонь! Дочка занимается хип-хопом, на конкурсе заняли второе место. Тренер профессиональный и мотивирующий.',
  true, now() - interval '3 weeks'
FROM users u WHERE u.email = 'alekseev@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-1', 4,
  'Хорошая подготовка к школе. Сын пошёл в первый класс полностью готовым — читал, считал, умел писать. Спасибо педагогам!',
  true, now() - interval '4 months'
FROM users u WHERE u.email = 'fedorova.yu@example.ru';

INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-3', 5,
  'Отличная спортивная школа! Сын ходит на плавание и футбол. Тренеры профессиональные, расписание удобное, зал современный.',
  true, now() - interval '2 months'
FROM users u WHERE u.email = 'kuznetsov@example.ru';

-- Reviews for educators
INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, ep.id, 5,
  'Анна Соколова — лучший репетитор по математике! Сын сдал ОГЭ на 5, хотя раньше не понимал ничего. Очень грамотный педагог.',
  true, now() - interval '5 months'
FROM users u
CROSS JOIN (SELECT ep2.id FROM educator_profiles ep2 JOIN users eu ON eu.id = ep2.user_id WHERE eu.email = 'sokolova@example.ru') ep
WHERE u.email = 'lebedeva@example.ru';

INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, ep.id, 5,
  'Дмитрий Орлов — замечательный педагог! Дочка за 8 месяцев с нуля научилась свободно говорить на английском.',
  true, now() - interval '3 months'
FROM users u
CROSS JOIN (SELECT ep2.id FROM educator_profiles ep2 JOIN users eu ON eu.id = ep2.user_id WHERE eu.email = 'orlov@example.ru') ep
WHERE u.email = 'nikolaev@example.ru';

INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, ep.id, 5,
  'Елена Герасимова — настоящий художник и педагог от бога. Занятия увлекательные, сын ждёт каждый урок с нетерпением!',
  true, now() - interval '2 months'
FROM users u
CROSS JOIN (SELECT ep2.id FROM educator_profiles ep2 JOIN users eu ON eu.id = ep2.user_id WHERE eu.email = 'gerasimova@example.ru') ep
WHERE u.email = 'fedorova.yu@example.ru';

INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, ep.id, 4,
  'Михаил — хороший педагог по программированию. Сын создал свою первую игру за 3 месяца. Занятия интересные, с проектами.',
  true, now() - interval '6 weeks'
FROM users u
CROSS JOIN (SELECT ep2.id FROM educator_profiles ep2 JOIN users eu ON eu.id = ep2.user_id WHERE eu.email = 'popov.m@example.ru') ep
WHERE u.email = 'kuznetsov@example.ru';

INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, ep.id, 5,
  'Ольга Белова — прекрасный педагог! Дочка занимается фортепиано уже два года, очень довольна. Выступила на городском конкурсе.',
  true, now() - interval '4 months'
FROM users u
CROSS JOIN (SELECT ep2.id FROM educator_profiles ep2 JOIN users eu ON eu.id = ep2.user_id WHERE eu.email = 'belova@example.ru') ep
WHERE u.email = 'parent@example.ru';

INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
SELECT gen_random_uuid()::text, u.id, ep.id, 5,
  'Павел Лисицын — отличный тренер по плаванию! Сын боялся воды, а теперь плавает кролем. Терпеливый и профессиональный.',
  true, now() - interval '3 months'
FROM users u
CROSS JOIN (SELECT ep2.id FROM educator_profiles ep2 JOIN users eu ON eu.id = ep2.user_id WHERE eu.email = 'lisitsyn@example.ru') ep
WHERE u.email = 'fedorova.yu@example.ru';

-- ============================================================
-- LEADS
-- ============================================================
INSERT INTO leads (id, parent_id, organization_id, service_id, child_id, status, message, parent_name, parent_phone, created_at, updated_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-5',
  (SELECT s.id FROM services s WHERE s.organization_id = 'seed-org-5' AND s.name_ru = 'Фортепиано' LIMIT 1),
  (SELECT c.id FROM children c WHERE c.parent_id = u.id AND c.name = 'Полина' LIMIT 1),
  'converted', 'Хотим записать дочку на фортепиано. Она уже немного занималась дома, есть базовые навыки.', u.name, u.phone,
  now() - interval '3 months', now() - interval '2 months'
FROM users u WHERE u.email = 'nikolaev@example.ru';

INSERT INTO leads (id, parent_id, organization_id, service_id, child_id, status, message, parent_name, parent_phone, created_at, updated_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-9',
  (SELECT s.id FROM services s WHERE s.organization_id = 'seed-org-9' AND s.name_ru = 'Хип-хоп (дети)' LIMIT 1),
  (SELECT c.id FROM children c WHERE c.parent_id = u.id AND c.name = 'Вика' LIMIT 1),
  'in_progress', 'Интересует хип-хоп для дочки 8 лет. Она очень активная, любит двигаться под музыку. Хотели бы попасть на пробное занятие.', u.name, u.phone,
  now() - interval '2 weeks', now() - interval '1 week'
FROM users u WHERE u.email = 'alekseev@example.ru';

INSERT INTO leads (id, parent_id, organization_id, service_id, child_id, status, message, parent_name, parent_phone, created_at, updated_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-7',
  (SELECT s.id FROM services s WHERE s.organization_id = 'seed-org-7' AND s.name_ru = 'Репетитор по математике' LIMIT 1),
  (SELECT c.id FROM children c WHERE c.parent_id = u.id AND c.name = 'Артём' LIMIT 1),
  'contacted', 'Нам нужен репетитор по математике. Сын в 10 классе, готовится к ЕГЭ. Хотелось бы начать как можно скорее.', u.name, u.phone,
  now() - interval '10 days', now() - interval '8 days'
FROM users u WHERE u.email = 'lebedeva@example.ru';

INSERT INTO leads (id, parent_id, organization_id, service_id, child_id, status, message, parent_name, parent_phone, created_at, updated_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-1',
  (SELECT s.id FROM services s WHERE s.organization_id = 'seed-org-1' AND s.name_ru = 'Математика и логика' LIMIT 1),
  (SELECT c.id FROM children c WHERE c.parent_id = u.id AND c.name = 'Максим' LIMIT 1),
  'new', 'Сыну 9 лет, хочет заниматься математикой. Есть ли место в группе? Когда можно прийти?', u.name, u.phone,
  now() - interval '3 days', now() - interval '3 days'
FROM users u WHERE u.email = 'fedorova.yu@example.ru';

INSERT INTO leads (id, parent_id, organization_id, service_id, child_id, status, message, parent_name, parent_phone, created_at, updated_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-6',
  (SELECT s.id FROM services s WHERE s.organization_id = 'seed-org-6' AND s.name_ru = 'Акварель для детей' LIMIT 1),
  (SELECT c.id FROM children c WHERE c.parent_id = u.id AND c.name = 'Соня' LIMIT 1),
  'new', 'Дочка (5 лет) очень любит рисовать. Хотим записать на акварель. Подходит ли ваша программа для совсем маленьких?', u.name, u.phone,
  now() - interval '1 day', now() - interval '1 day'
FROM users u WHERE u.email = 'kuznetsov@example.ru';

INSERT INTO leads (id, parent_id, organization_id, service_id, status, message, parent_name, parent_phone, created_at, updated_at)
SELECT gen_random_uuid()::text, u.id, 'seed-org-8',
  (SELECT s.id FROM services s WHERE s.organization_id = 'seed-org-8' AND s.name_ru = 'Начальная школа (1–4 класс)' LIMIT 1),
  'rejected', 'Рассматриваем частную школу для сына, который идёт в 1 класс. Какие документы нужны для поступления?', u.name, u.phone,
  now() - interval '2 months', now() - interval '2 months'
FROM users u WHERE u.email = 'parent@example.ru';

END $$;
