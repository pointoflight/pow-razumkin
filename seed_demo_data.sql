-- Demo data: diverse cities, language schools, sports clubs, art studios
-- Designed to showcase AI search with queries like:
--   "Spanish in Sochi ~20k/month", "tennis in SPb for 8yo", "drawing in Kazan for 10yo"
DO $$
DECLARE
  h TEXT := '$2a$12$KmH2qWrnaJlja4eZ4tNQyuDxYi6Yl318kI5YJQCkDK5e4e0aROZj2';
  biz_sochi1 TEXT; biz_sochi2 TEXT; biz_spb1 TEXT; biz_kazan1 TEXT; biz_misc1 TEXT;
  org_id TEXT;
  par_review TEXT;
  edu_sochi TEXT; edu_kazan TEXT;
BEGIN

-- ── Business owners ────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at) VALUES
  (gen_random_uuid()::text, 'sochi.lang@example.ru',  h, 'Виктория Морозова',  '+7 862 100-01-01', 'business_owner', now()-interval '10 months', now()),
  (gen_random_uuid()::text, 'sochi.lang2@example.ru', h, 'Арман Петросян',     '+7 862 100-02-02', 'business_owner', now()-interval '8 months',  now()),
  (gen_random_uuid()::text, 'spb.sport@example.ru',   h, 'Иван Захаров',       '+7 812 200-01-01', 'business_owner', now()-interval '12 months', now()),
  (gen_random_uuid()::text, 'kazan.art@example.ru',   h, 'Лилия Хасанова',     '+7 843 300-01-01', 'business_owner', now()-interval '9 months',  now()),
  (gen_random_uuid()::text, 'misc.edu@example.ru',    h, 'Пётр Семёнов',       '+7 495 400-01-01', 'business_owner', now()-interval '7 months',  now())
ON CONFLICT (email) DO NOTHING;

SELECT id INTO biz_sochi1 FROM users WHERE email = 'sochi.lang@example.ru';
SELECT id INTO biz_sochi2 FROM users WHERE email = 'sochi.lang2@example.ru';
SELECT id INTO biz_spb1   FROM users WHERE email = 'spb.sport@example.ru';
SELECT id INTO biz_kazan1 FROM users WHERE email = 'kazan.art@example.ru';
SELECT id INTO biz_misc1  FROM users WHERE email = 'misc.edu@example.ru';

-- ── СОЧИ: Spanish language schools ────────────────────────────────────

-- 1. EspañolSochi — premium individual Spanish
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-s1', biz_sochi1,
  'Языковой центр «EspañolSochi»',
  'Специализированная школа испанского языка в Сочи. Работаем только с испанским — а значит, делаем это на 100%. Носители языка в преподавательском составе. Методика полного погружения: занятия, клубы разговорной практики, испанское кино по пятницам. Дети от 5 лет, взрослые любого уровня. Готовим к DELE. Онлайн и очно.',
  'language', 'ул. Навагинская, 16', 'Сочи', '+7 862 555-10-20', 'info@espanol-sochi.ru',
  true, true, now()-interval '10 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-s1', 'Испанский язык — индивидуально',
   'Персональные занятия с преподавателем-носителем. Программа составляется под уровень и цели: разговорный, деловой, DELE. Занятия 2 раза в неделю по 60 мин.',
   12000, 16000, 5, 99, '2 раза в неделю, по договорённости', true, now()-interval '9 months'),
  (gen_random_uuid()::text, 'demo-org-s1', 'Испанский язык — мини-группа (2–3 чел.)',
   'Занятия в микро-группе до 3 человек. Сохраняется индивидуальный подход при снижении стоимости. 2 раза в неделю по 60 мин.',
   6500, 8000, 6, 18, '2 раза в неделю', true, now()-interval '9 months'),
  (gen_random_uuid()::text, 'demo-org-s1', 'Детский испанский (5–10 лет)',
   'Игровой метод обучения испанскому для самых маленьких. Песни, сказки, игры на испанском. Занятия 2 раза в неделю по 45 мин.',
   7000, 9000, 5, 10, '2 раза в неделю', true, now()-interval '8 months'),
  (gen_random_uuid()::text, 'demo-org-s1', 'Испанский — интенсивный курс',
   'Подходит для туристов, путешественников и тех, кто хочет быстрый результат. 20 занятий за месяц, погружение в разговорный испанский.',
   18000, 22000, 14, 99, 'Ежедневно 5 дней в неделю', true, now()-interval '7 months')
ON CONFLICT (id) DO NOTHING;

-- 2. Полиглот Сочи — multi-language center with Spanish
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-s2', biz_sochi1,
  'Центр иностранных языков «Полиглот Сочи»',
  'Иностранные языки для детей и взрослых в Сочи. Испанский, английский, французский, немецкий, итальянский. Занятия в группах до 8 человек и индивидуально. Современные методики, уютные классы, дружелюбная атмосфера. Сертифицированные преподаватели с опытом работы за рубежом. Пробное занятие бесплатно.',
  'language', 'пр. Курортный, 75', 'Сочи', '+7 862 555-20-30', 'hello@polyglot-sochi.ru',
  true, true, now()-interval '8 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-s2', 'Испанский язык (группа до 8 чел.)',
   'Занятия в группе с коммуникативным уклоном. Уровни: A1–C1. Тематические разговорные клубы по субботам — бесплатно для учеников.',
   5500, 7000, 7, 99, '2–3 раза в неделю', true, now()-interval '7 months'),
  (gen_random_uuid()::text, 'demo-org-s2', 'Английский язык (группа до 8 чел.)',
   'Классический курс английского по Cambridge-программе. Подготовка к FCE, CAE. Все уровни.',
   5000, 6500, 6, 99, '3 раза в неделю', true, now()-interval '7 months'),
  (gen_random_uuid()::text, 'demo-org-s2', 'Французский язык (группа)',
   'Французский для начинающих и продолжающих. Носитель ведёт разговорные занятия по средам.',
   5500, 7000, 10, 99, '2 раза в неделю', true, now()-interval '6 months'),
  (gen_random_uuid()::text, 'demo-org-s2', 'Детский языковой лагерь «Лингва»',
   'Летний языклагерь: испанский или английский 4 часа в день. Прогулки, квесты, кино на языке.',
   19000, 22000, 7, 14, 'Июнь–август, 2 недели', true, now()-interval '3 months')
ON CONFLICT (id) DO NOTHING;

-- 3. La Meridiana — premium Spanish immersion
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-s3', biz_sochi2,
  'Школа испанского языка «La Meridiana»',
  'Премиум-школа испанского в Сочи. Только испанский, только лучшие преподаватели. Три преподавателя — носители из Испании и Латинской Америки. Метод погружения: все занятия ведутся исключительно на испанском с первого дня. Максимум 4 человека в группе. Подготовка к DELE A2–C2. Международный сертификат.',
  'language', 'ул. Театральная, 8', 'Сочи', '+7 862 555-30-40', 'hola@la-meridiana.ru',
  true, true, now()-interval '6 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-s3', 'Испанский — полное погружение (PRO)',
   'Флагманский курс. 4 занятия в неделю с носителем. Лексика, грамматика, аудирование, разговорная практика. Домашние задания с проверкой.',
   17000, 20000, 12, 99, '4 раза в неделю по 60 мин', true, now()-interval '5 months'),
  (gen_random_uuid()::text, 'demo-org-s3', 'Испанский — Express (2 мес.)',
   'Ускоренный курс разговорного испанского. За 2 месяца: базовый словарный запас, ключевые конструкции, уверенный туристический уровень.',
   13000, 16000, 14, 99, '3 раза в неделю', true, now()-interval '4 months'),
  (gen_random_uuid()::text, 'demo-org-s3', 'Подготовка к DELE',
   'Специализированный курс подготовки к международному экзамену DELE (уровни А2, В1, В2, С1). Пробные экзамены в формате реального DELE.',
   15000, 18000, 14, 99, '3 раза в неделю', true, now()-interval '3 months')
ON CONFLICT (id) DO NOTHING;

-- ── САНКТ-ПЕТЕРБУРГ: Tennis clubs ────────────────────────────────────

-- 4. Теннисный клуб «Смена»
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-p1', biz_spb1,
  'Теннисный клуб «Смена»',
  'Один из старейших теннисных клубов Петербурга. 8 крытых кортов, 4 открытых. Тренеры — мастера спорта и кандидаты. Группы для детей с 5 лет. Специальная программа «Первая ракетка» для детей 6–10 лет. Участие в городских и всероссийских турнирах. Прокат инвентаря.',
  'sports_club', 'пр. Энгельса, 14', 'Санкт-Петербург', '+7 812 444-10-10', 'info@smena-tennis.ru',
  true, true, now()-interval '14 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-p1', 'Теннис — группа «Малыши» (5–7 лет)',
   'Знакомство с теннисом в игровой форме. Развитие координации, ловкости. Занятия на мини-кортах с мягкими мячами. Группы по 4–6 детей.',
   3500, 4500, 5, 7, '2 раза в неделю по 50 мин', true, now()-interval '13 months'),
  (gen_random_uuid()::text, 'demo-org-p1', 'Теннис — группа «Юниоры» (8–12 лет)',
   'Систематическое обучение техническим приёмам. Подача, удар справа/слева, выход к сетке. Участие в клубных турнирах. Группы 4–6 человек.',
   4000, 5500, 8, 12, '3 раза в неделю по 60 мин', true, now()-interval '12 months'),
  (gen_random_uuid()::text, 'demo-org-p1', 'Теннис — индивидуальные тренировки',
   'Занятие один на один с тренером. Программа составляется под текущий уровень и цели ребёнка. Возможен выбор тренера.',
   5000, 7000, 6, 18, 'По договорённости', true, now()-interval '11 months')
ON CONFLICT (id) DO NOTHING;

-- 5. Академия тенниса «Большой шлем»
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-p2', biz_spb1,
  'Академия тенниса «Большой шлем»',
  'Профессиональная теннисная академия в Санкт-Петербурге. Готовим спортсменов с нуля до уровня соревнований. Наши воспитанники — участники юношеских чемпионатов России. Тренерский состав: 5 тренеров, в том числе заслуженный тренер РФ. Видеоанализ техники. Спортивная психология. Физподготовка.',
  'sports_club', 'ул. Бухарестская, 110', 'Санкт-Петербург', '+7 812 444-20-20', 'info@bolshoy-slem.ru',
  true, true, now()-interval '11 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-p2', 'Начинающие (7–10 лет)',
   'Базовая программа: техника ударов, правила игры, физподготовка. 3 тренировки в неделю + 1 занятие ОФП.',
   5500, 7000, 7, 10, '3+1 раза в неделю', true, now()-interval '10 months'),
  (gen_random_uuid()::text, 'demo-org-p2', 'Продвинутая группа (11–16 лет)',
   'Для тех, кто уже умеет играть и хочет соревноваться. Турнирная подготовка, видеоразбор, тактика.',
   7000, 9000, 11, 16, '4 раза в неделю', true, now()-interval '9 months'),
  (gen_random_uuid()::text, 'demo-org-p2', 'Индивидуальный тренинг',
   'Работа с личным тренером, полная индивидуализация программы. Подходит для подготовки к конкретному турниру.',
   6500, 10000, 7, 18, 'По расписанию', true, now()-interval '8 months')
ON CONFLICT (id) DO NOTHING;

-- ── КАЗАНЬ: Art studios ────────────────────────────────────────────────

-- 6. Арт-студия «Акварель»
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-k1', biz_kazan1,
  'Арт-студия «Акварель»',
  'Уютная художественная студия для детей и подростков в Казани. Рисунок, акварель, масло, пастель, скетчинг. Маленькие группы — не более 6 человек. Занятия с детьми от 4 лет. Опытные педагоги с профильным художественным образованием. Ежемесячные выставки работ учеников. Все материалы включены в стоимость.',
  'art', 'ул. Баумана, 44', 'Казань', '+7 843 555-10-10', 'info@akvarel-kazan.ru',
  true, true, now()-interval '9 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-k1', 'Рисунок и живопись (4–7 лет)',
   'Занятия для самых маленьких. Изучаем цвет, форму, пространство через игру и творчество. Акварель, гуашь, карандаш.',
   3500, 4500, 4, 7, '2 раза в неделю по 45 мин', true, now()-interval '8 months'),
  (gen_random_uuid()::text, 'demo-org-k1', 'Академический рисунок (8–14 лет)',
   'Основы академического рисунка: линия, тон, перспектива. Натюрморт, портрет, фигура человека.',
   4000, 5000, 8, 14, '2 раза в неделю по 60 мин', true, now()-interval '8 months'),
  (gen_random_uuid()::text, 'demo-org-k1', 'Акварельная живопись',
   'Техники акварели: заливка, размывка, лессировка. Работы в жанрах: пейзаж, ботаническая иллюстрация, архитектурный скетч.',
   4500, 5500, 9, 99, '2 раза в неделю по 60 мин', true, now()-interval '7 months'),
  (gen_random_uuid()::text, 'demo-org-k1', 'Подготовка к поступлению в художественную школу',
   'Целенаправленная подготовка к вступительным экзаменам. Рисунок, живопись, композиция — три предмета, как на экзамене.',
   6000, 7500, 9, 14, '3 раза в неделю', true, now()-interval '5 months')
ON CONFLICT (id) DO NOTHING;

-- 7. Художественная школа «Мастерская»
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-k2', biz_kazan1,
  'Детская художественная школа «Мастерская»',
  'Художественная школа с 15-летней историей в Казани. Системное художественное образование для детей 5–17 лет. Программы от «Первые шаги в искусстве» до подготовки в художественные вузы. Педагоги — члены Союза художников Татарстана. Живопись, рисунок, скульптура, декоративно-прикладное искусство, история искусства.',
  'art', 'пр. Победы, 22', 'Казань', '+7 843 555-20-20', 'school@masterskaya-kzn.ru',
  true, true, now()-interval '8 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-k2', 'Основной курс (5–10 лет)',
   'Базовое художественное образование: рисунок карандашом, живопись гуашью и акварелью, лепка. 2 занятия в неделю по 90 мин.',
   3800, 4800, 5, 10, '2 раза в неделю по 90 мин', true, now()-interval '7 months'),
  (gen_random_uuid()::text, 'demo-org-k2', 'Живопись маслом (от 10 лет)',
   'Работа масляными красками: грунтовка холста, построение, многослойная живопись. Натюрморты, пейзажи, портрет.',
   4500, 6000, 10, 18, '2 раза в неделю по 90 мин', true, now()-interval '6 months'),
  (gen_random_uuid()::text, 'demo-org-k2', 'Скульптура и лепка',
   'Лепка из глины и полимерной глины. От простых форм до портретного рельефа. Обжиг изделий из глины.',
   3500, 4500, 6, 16, '2 раза в неделю по 60 мин', true, now()-interval '5 months'),
  (gen_random_uuid()::text, 'demo-org-k2', 'Вечерние классы для родителей',
   'Занятия рисованием и живописью для взрослых. Начинающие и опытные. Среда и пятница 19:00–21:00.',
   3000, 4000, 18, 99, 'Ср и пт вечером', true, now()-interval '3 months')
ON CONFLICT (id) DO NOTHING;

-- 8. Творческий центр «Цвет» Казань
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-k3', biz_kazan1,
  'Детский творческий центр «Цвет»',
  'Место, где дети открывают свой творческий потенциал. Студия рисования, лепки, ручного труда и декоративно-прикладного искусства. Работаем с детьми от 3 до 14 лет. Маленькие группы — максимум 8 человек. Радостная и вдохновляющая атмосфера. Ежеквартальные выставки и мастер-классы для родителей.',
  'art', 'ул. Чистопольская, 55', 'Казань', '+7 843 555-30-30', 'svet@tvortsvet.ru',
  false, true, now()-interval '5 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-k3', 'Студия рисования (3–6 лет)',
   'Рисование для малышей: пальчиковые краски, штампы, кляксография. Развитие мелкой моторики и цветовосприятия.',
   2800, 3500, 3, 6, '2 раза в неделю по 40 мин', true, now()-interval '4 months'),
  (gen_random_uuid()::text, 'demo-org-k3', 'Студия рисования (7–14 лет)',
   'Разнообразие техник: карандаш, маркеры, акварель, коллаж, цифровое искусство на планшете.',
   3500, 4200, 7, 14, '2 раза в неделю по 60 мин', true, now()-interval '4 months'),
  (gen_random_uuid()::text, 'demo-org-k3', 'Лепка и керамика',
   'Работа с глиной и полимерной глиной. Изготовление посуды, фигурок, украшений.',
   3200, 4000, 5, 14, '2 раза в неделю по 60 мин', true, now()-interval '3 months')
ON CONFLICT (id) DO NOTHING;

-- ── ДОПОЛНИТЕЛЬНЫЕ ГОРОДА ─────────────────────────────────────────────

-- 9. Школа плавания «Дельфин» — Новосибирск
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-n1', biz_misc1,
  'Школа плавания «Дельфин»',
  'Обучение плаванию детей с нуля в Новосибирске. Работаем в бассейне ФОК «Заря» (25 м, 6 дорожек). Тренеры с высшим спортивным образованием и опытом подготовки разрядников. Программы для детей от 3 лет. Группы по 4 человека — тренер всегда рядом. Подготовка к соревнованиям по спортивному плаванию.',
  'sports_club', 'ул. Ватутина, 43', 'Новосибирск', '+7 383 666-10-10', 'info@dolphin-nsk.ru',
  true, true, now()-interval '11 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-n1', 'Плавание для малышей (3–6 лет)',
   'Адаптация к воде, базовые навыки. Занятия с мамой/папой — родители в воде вместе с ребёнком. 2 раза в неделю.',
   3500, 4500, 3, 6, '2 раза в неделю', true, now()-interval '10 months'),
  (gen_random_uuid()::text, 'demo-org-n1', 'Плавание — базовый уровень (7–12 лет)',
   'Изучение кролю, брасса, на спине. После курса ребёнок уверенно плывёт всеми стилями.',
   4000, 5000, 7, 12, '3 раза в неделю', true, now()-interval '10 months'),
  (gen_random_uuid()::text, 'demo-org-n1', 'Спортивное плавание',
   'Для детей, нацеленных на соревнования. Интенсивные тренировки, развитие скорости, выносливости.',
   5000, 6500, 8, 16, '4–5 раз в неделю', true, now()-interval '8 months')
ON CONFLICT (id) DO NOTHING;

-- 10. Языковой центр «Lingua» — Новосибирск
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-n2', biz_misc1,
  'Языковой центр «Lingua Новосибирск»',
  'Иностранные языки для детей и взрослых в Новосибирске. Английский, немецкий, испанский, китайский. Авторские программы для детей по возрастам. Подготовка к международным экзаменам. Разговорный клуб по субботам. Летние языковые лагеря.',
  'language', 'Красный проспект, 28', 'Новосибирск', '+7 383 666-20-20', 'info@lingua-nsk.ru',
  true, true, now()-interval '9 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-n2', 'Английский язык (5–8 лет)',
   'Игровой формат: песни, мультфильмы, кукольный театр на английском. Занятия 2 раза в неделю.',
   4500, 5500, 5, 8, '2 раза в неделю', true, now()-interval '8 months'),
  (gen_random_uuid()::text, 'demo-org-n2', 'Английский язык (9–13 лет)',
   'Школьная программа + разговорная практика. Работа с аутентичными материалами. Cambridge-курс.',
   5000, 6500, 9, 13, '3 раза в неделю', true, now()-interval '8 months'),
  (gen_random_uuid()::text, 'demo-org-n2', 'Испанский язык (все возрасты)',
   'Испанский с нуля до B2. Носители языка ведут разговорные занятия по пятницам.',
   5000, 7000, 8, 99, '2 раза в неделю', true, now()-interval '6 months')
ON CONFLICT (id) DO NOTHING;

-- 11. Футбольная академия — Краснодар
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-c1', biz_misc1,
  'Футбольная академия «Кубань»',
  'Профессиональная футбольная академия в Краснодаре. Тренировки на натуральном и искусственном газоне. Тренерский штаб из бывших профессиональных игроков. Группы с 4 лет. Турниры, сборы, экипировка в стоимость. Партнёрство с ФК «Краснодар».',
  'sports_club', 'ул. Ставропольская, 156', 'Краснодар', '+7 861 777-10-10', 'info@kuban-football.ru',
  true, true, now()-interval '10 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-c1', 'Футбол — дошкольная группа (4–6 лет)',
   'Мини-футбол для самых маленьких. Развитие координации, ловкости, командного духа. Форма включена.',
   3000, 3800, 4, 6, '2 раза в неделю', true, now()-interval '9 months'),
  (gen_random_uuid()::text, 'demo-org-c1', 'Футбол — основная группа (7–12 лет)',
   'Систематическое обучение: техника, тактика, физподготовка. Участие в городских соревнованиях.',
   4000, 5000, 7, 12, '3 раза в неделю', true, now()-interval '9 months'),
  (gen_random_uuid()::text, 'demo-org-c1', 'Юниоры (13–17 лет)',
   'Для тех, кто серьёзно занимается. Интенсивные тренировки, сборы, матчи в региональных лигах.',
   5000, 6500, 13, 17, '4–5 раз в неделю', true, now()-interval '8 months')
ON CONFLICT (id) DO NOTHING;

-- 12. Гимнастический клуб — Екатеринбург
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-e1', biz_misc1,
  'Гимнастический клуб «Олимп»',
  'Художественная и спортивная гимнастика для девочек в Екатеринбурге. Зал 600 кв.м с профессиональным оборудованием. Тренеры — мастера спорта России. Подготовка к соревнованиям от городского до всероссийского уровня. Группы с 3,5 лет. Костюмы и инвентарь для первого года занятий — в подарок.',
  'sports_club', 'пр. Ленина, 50а', 'Екатеринбург', '+7 343 888-10-10', 'info@olimp-gym.ru',
  true, true, now()-interval '12 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-e1', 'Художественная гимнастика (3,5–6 лет)',
   'Общеразвивающая программа: гибкость, растяжка, базовые элементы с предметами (мяч, обруч).',
   4000, 5000, 4, 6, '3 раза в неделю', true, now()-interval '11 months'),
  (gen_random_uuid()::text, 'demo-org-e1', 'Художественная гимнастика (7–12 лет)',
   'Спортивная программа для разрядного продвижения. 3 звезды → 3 разряд → 1 разряд.',
   5500, 7000, 7, 12, '4 раза в неделю', true, now()-interval '10 months'),
  (gen_random_uuid()::text, 'demo-org-e1', 'Акробатика',
   'Базовая акробатика: кувырки, стойки, колёса, перевороты. Подходит как допфизподготовка.',
   3500, 4500, 5, 14, '2 раза в неделю', true, now()-interval '8 months')
ON CONFLICT (id) DO NOTHING;

-- 13. Ментальная арифметика — Москва
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-m1', biz_misc1,
  'Школа ментальной арифметики «Умный Абакус»',
  'Развиваем скорость счёта и умственные способности детей через технику ментальной арифметики. Программа японского абакуса адаптирована для российских детей. Занятия в группах до 6 детей, 2 раза в неделю. После курса дети умножают трёхзначные числа в уме быстрее калькулятора.',
  'center', 'ул. Новый Арбат, 32', 'Москва', '+7 495 100-20-30', 'info@umny-abacus.ru',
  true, true, now()-interval '6 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-m1', 'Ментальная арифметика (5–7 лет)',
   'Введение в счёт на абакусе. Цифры, простые операции, визуализация. 7 уровней программы.',
   4500, 5500, 5, 7, '2 раза в неделю по 60 мин', true, now()-interval '5 months'),
  (gen_random_uuid()::text, 'demo-org-m1', 'Ментальная арифметика (8–12 лет)',
   'Продвинутый уровень: четыре действия с большими числами, скорость, точность.',
   5000, 6000, 8, 12, '2 раза в неделю по 60 мин', true, now()-interval '5 months')
ON CONFLICT (id) DO NOTHING;

-- 14. Шахматная школа — Нижний Новгород
INSERT INTO organizations (id, owner_id, name, description, type, address, city, phone, email, is_verified, is_active, created_at, updated_at)
VALUES ('demo-org-nn1', biz_misc1,
  'Шахматная школа «Гроссмейстер»',
  'Обучение шахматам детей с 4 лет в Нижнем Новгороде. Тренеры — кандидаты в мастера спорта, участники всероссийских турниров. Занятия в группах и индивидуально. Онлайн-формат. Участие в городских, областных и всероссийских соревнованиях. Анализ партий, шахматная теория, миттельшпиль и эндшпиль.',
  'center', 'ул. Большая Покровская, 8', 'Нижний Новгород', '+7 831 999-10-10', 'info@grossmaster-nn.ru',
  false, true, now()-interval '7 months', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, organization_id, name_ru, description_ru, price_from, price_to, age_from, age_to, schedule_info, is_active, created_at) VALUES
  (gen_random_uuid()::text, 'demo-org-nn1', 'Шахматы для начинающих',
   'Правила игры, ценность фигур, тактические мотивы. Программа рассчитана на 6 месяцев.',
   2800, 3500, 4, 14, '2 раза в неделю', true, now()-interval '6 months'),
  (gen_random_uuid()::text, 'demo-org-nn1', 'Продвинутый курс',
   'Изучение дебютного репертуара, типовые планы в миттельшпиле, техника реализации преимущества.',
   3500, 4500, 8, 18, '2 раза в неделю', true, now()-interval '5 months')
ON CONFLICT (id) DO NOTHING;

-- ── NEW EDUCATORS ─────────────────────────────────────────────────────

-- Educator: Spanish teacher in Sochi
INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at) VALUES
  (gen_random_uuid()::text, 'garcia.sochi@example.ru', h, 'Мигель Гарсия', '+7 862 600-01-01', 'educator', now()-interval '5 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu_sochi FROM users WHERE email = 'garcia.sochi@example.ru';

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu_sochi,
  'Носитель испанского языка, уроженец Барселоны. Живу в Сочи с 2019 года, обучаю испанскому детей и взрослых. Диплом преподавателя иностранных языков Барселонского университета. Специализируюсь на разговорном испанском и подготовке к DELE. Детские занятия от 6 лет — игровой метод, песни, мультфильмы на испанском. Взрослые — разговорный клуб по пятницам. Подтверждённый уровень: носитель C2.',
  ARRAY['Испанский язык', 'DELE', 'Разговорный испанский', 'Испанский для детей', 'Испанская культура'], 9, 'Сочи', true, now()-interval '5 months', now())
ON CONFLICT (user_id) DO NOTHING;

-- Educator: art teacher in Kazan
INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at) VALUES
  (gen_random_uuid()::text, 'rinatova.kazan@example.ru', h, 'Алина Ринатова', '+7 843 700-01-01', 'educator', now()-interval '4 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO edu_kazan FROM users WHERE email = 'rinatova.kazan@example.ru';

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (gen_random_uuid()::text, edu_kazan,
  'Художник и педагог из Казани. Окончила Казанское художественное училище и Казанский государственный университет культуры. Провожу индивидуальные уроки рисования и живописи для детей от 5 лет. Работаю с акварелью, маслом, пастелью. Помогаю детям полюбить искусство, научиться видеть красоту вокруг. Подготовила 12 учеников к поступлению в художественные школы.',
  ARRAY['Рисование', 'Живопись', 'Акварель', 'Масляная живопись', 'Пастель', 'Подготовка к худ. школе'], 11, 'Казань', true, now()-interval '4 months', now())
ON CONFLICT (user_id) DO NOTHING;

-- ── REVIEWS for new orgs ───────────────────────────────────────────────
SELECT id INTO par_review FROM users WHERE email = 'parent@example.ru';

IF par_review IS NOT NULL THEN
  INSERT INTO reviews (id, author_id, organization_id, rating, body, is_moderated, created_at) VALUES
    (gen_random_uuid()::text, par_review, 'demo-org-s1', 5,
     'Отличная школа! Дочь занимается испанским 6 месяцев, прогресс колоссальный. Преподаватель — носитель, объясняет очень понятно. Атмосфера приятная, группы маленькие.', true, now()-interval '3 months'),
    (gen_random_uuid()::text, par_review, 'demo-org-s2', 4,
     'Хороший центр, удобное расписание. Сын занимается испанским и английским. Преподаватели профессиональные, программа насыщенная.', true, now()-interval '2 months'),
    (gen_random_uuid()::text, par_review, 'demo-org-p1', 5,
     'Тренировки по теннису на высшем уровне. Сын (8 лет) занимается уже год, прогресс заметен. Тренеры внимательные, умеют работать с детьми.', true, now()-interval '4 months'),
    (gen_random_uuid()::text, par_review, 'demo-org-p2', 5,
     'Академия топ! Дочь мечтала о теннисе — теперь уже участвует в городских турнирах. Тренерский состав профессиональный.', true, now()-interval '2 months'),
    (gen_random_uuid()::text, par_review, 'demo-org-k1', 5,
     'Арт-студия — просто находка для нас. Дочь (10 лет) ходит с огромным удовольствием. Педагог — настоящий профессионал. Работы Насти регулярно попадают на выставки.', true, now()-interval '1 month'),
    (gen_random_uuid()::text, par_review, 'demo-org-k2', 5,
     'Прекрасная школа с сильными педагогами. Сын занимается скульптурой и живописью. Очень доволен. Готовимся к поступлению в Казанское художественное.', true, now()-interval '2 months')
  ON CONFLICT DO NOTHING;
END IF;

END $$;
