DO $$
DECLARE
  h TEXT := '$2a$12$KmH2qWrnaJlja4eZ4tNQyuDxYi6Yl318kI5YJQCkDK5e4e0aROZj2';
  teacher_id TEXT;
  ep_id TEXT;
  par2 TEXT; par3 TEXT; par4 TEXT; par5 TEXT; par1 TEXT;
BEGIN

INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'teacher@example.ru', h, 'Мария Коваль', '+7 916 777-88-99', 'educator', now() - interval '6 months', now())
ON CONFLICT (email) DO NOTHING;
SELECT id INTO teacher_id FROM users WHERE email = 'teacher@example.ru';

INSERT INTO educator_profiles (id, user_id, bio, specializations, experience_years, city, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid()::text,
  teacher_id,
  'Репетитор по математике и подготовке к ЕГЭ/ОГЭ. За 12 лет работы помогла более 300 ученикам — от двоечников до призёров олимпиад.

Моя методология основана на трёх принципах: глубокое понимание (не зубрёжка), системный разбор ошибок и постепенное усложнение. Я не просто объясняю теорию — я показываю логику математики, учу думать. Каждое занятие начинается с диагностики: определяю, где именно возникает проблема, и работаем прицельно.

Специализируюсь на сложных случаях: дети с математической тревогой, смена школьной программы, экстерн и семейное обучение. Средний балл моих учеников на ЕГЭ — 82 из 100.

Работаю онлайн (по всей России) и очно (Москва, р-н Арбат). Первое занятие — диагностика бесплатно.',
  ARRAY['Математика', 'ЕГЭ (профиль)', 'ОГЭ', 'Олимпиадная математика', 'Алгебра', 'Геометрия', 'Тригонометрия'],
  12,
  'Москва',
  true,
  now() - interval '6 months',
  now()
)
ON CONFLICT (user_id) DO NOTHING;
SELECT id INTO ep_id FROM educator_profiles WHERE user_id = teacher_id;

SELECT id INTO par1 FROM users WHERE email = 'parent@example.ru';
SELECT id INTO par2 FROM users WHERE email = 'kuznetsov@example.ru';
SELECT id INTO par3 FROM users WHERE email = 'lebedeva@example.ru';
SELECT id INTO par4 FROM users WHERE email = 'nikolaev@example.ru';
SELECT id INTO par5 FROM users WHERE email = 'fedorova.yu@example.ru';

INSERT INTO leads (id, parent_id, educator_id, status, message, parent_name, parent_phone, notes, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, par2, ep_id, 'converted',
   'Здравствуйте! Сыну 10 лет, сильно отстаёт по математике. У него пробелы ещё с начальной школы. Хотим заниматься 2 раза в неделю.',
   'Сергей Кузнецов', '+7 916 111-00-01',
   'Провели диагностику. Пробелы в дробях и отрицательных числах. Занимаемся вт и чт.',
   now() - interval '4 months', now() - interval '3 months'),

  (gen_random_uuid()::text, par3, ep_id, 'in_progress',
   'Добрый день! Сын в 10 классе, нацелен на ЕГЭ профиль. Хочет 80+. Сейчас пишет пробники на 55-60.',
   'Татьяна Лебедева', '+7 903 222-00-02',
   'Занимаемся раз в неделю по 90 мин. Основной упор — задания 13-19 части 2.',
   now() - interval '2 months', now() - interval '1 month'),

  (gen_random_uuid()::text, par4, ep_id, 'contacted',
   'Дочка готовится к ОГЭ. В этом году. Хотим срочно начать.',
   'Андрей Николаев', '+7 925 333-00-03', NULL,
   now() - interval '3 weeks', now() - interval '2 weeks'),

  (gen_random_uuid()::text, par5, ep_id, 'new',
   'Нашла вас через сайт. Сын 8 класс, хочет на олимпиады. Есть ли у вас опыт с олимпиадниками?',
   'Юлия Федорова', '+7 916 444-00-04', NULL,
   now() - interval '3 days', now() - interval '3 days');

INSERT INTO reviews (id, author_id, educator_id, rating, body, is_moderated, created_at)
VALUES
  (gen_random_uuid()::text, par2, ep_id, 5,
   'Мария — настоящий профессионал! Сын занимался полгода — с двойки вышел на четвёрку. Главное, что он теперь понимает математику, а не просто учит формулы.',
   true, now() - interval '2 months'),

  (gen_random_uuid()::text, par4, ep_id, 5,
   'Дочь сдала ОГЭ на 4 после 4 месяцев занятий. Мария умеет объяснять так, что сложные вещи становятся понятными. Очень рада, что нашла её.',
   true, now() - interval '5 months'),

  (gen_random_uuid()::text, par1, ep_id, 5,
   'Занимаемся уже год, ребёнок полюбил математику! Мария терпеливая, всегда готовит индивидуальные задания. Рекомендую всем, кто ищет настоящего репетитора.',
   true, now() - interval '1 month');

END $$;
