-- Очищаем существующие данные
TRUNCATE TABLE lesson_options CASCADE;
TRUNCATE TABLE lesson_questions CASCADE;
TRUNCATE TABLE lesson_tests CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- Добавляем новые уроки

-- 1. Грамматика: Present Simple
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Present Simple: Основы',
  '<h2>Present Simple: Основы</h2>
  <p>Present Simple - это простое настоящее время в английском языке. Оно используется для описания:</p>
  <ul>
    <li>Регулярных действий и привычек</li>
    <li>Фактов и общих истин</li>
    <li>Расписаний и программ</li>
  </ul>
  <h3>Образование:</h3>
  <p>Утвердительная форма:</p>
  <ul>
    <li>I/You/We/They + глагол (work, study, play)</li>
    <li>He/She/It + глагол + s/es (works, studies, plays)</li>
  </ul>
  <p>Отрицательная форма:</p>
  <ul>
    <li>I/You/We/They + do not (don''t) + глагол</li>
    <li>He/She/It + does not (doesn''t) + глагол</li>
  </ul>
  <h3>Примеры:</h3>
  <ul>
    <li>I work every day. (Я работаю каждый день)</li>
    <li>She studies English. (Она изучает английский)</li>
    <li>They don''t like coffee. (Они не любят кофе)</li>
  </ul>',
  'beginner',
  1
);

-- 2. Лексика: Семья и отношения
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Семья и отношения',
  '<h2>Семья и отношения</h2>
  <p>В этом уроке вы изучите слова, связанные с семьей и отношениями.</p>
  <h3>Основные слова:</h3>
  <ul>
    <li>mother (мать)</li>
    <li>father (отец)</li>
    <li>sister (сестра)</li>
    <li>brother (брат)</li>
    <li>grandmother (бабушка)</li>
    <li>grandfather (дедушка)</li>
  </ul>
  <h3>Упражнение:</h3>
  <p>Составьте предложения о своей семье, используя новые слова.</p>
  <p>Пример: My mother is a teacher. (Моя мама - учитель)</p>',
  'beginner',
  2
);

-- 3. Грамматика: Past Simple
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Past Simple: Прошедшее время',
  '<h2>Past Simple: Прошедшее время</h2>
  <p>Past Simple используется для описания действий, которые произошли в прошлом и завершились.</p>
  <h3>Образование:</h3>
  <p>Утвердительная форма:</p>
  <ul>
    <li>Правильные глаголы: глагол + ed (worked, played)</li>
    <li>Неправильные глаголы: вторая форма (went, saw)</li>
  </ul>
  <h3>Примеры:</h3>
  <ul>
    <li>I worked yesterday. (Я работал вчера)</li>
    <li>She went to school. (Она пошла в школу)</li>
    <li>They didn''t watch TV. (Они не смотрели телевизор)</li>
  </ul>',
  'intermediate',
  3
);

-- 4. Практика: Диалоги в ресторане
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Диалоги в ресторане',
  '<h2>Диалоги в ресторане</h2>
  <p>В этом уроке вы научитесь общаться в ресторане.</p>
  <h3>Полезные фразы:</h3>
  <ul>
    <li>Can I see the menu, please? (Можно меню, пожалуйста?)</li>
    <li>I would like to order... (Я бы хотел заказать...)</li>
    <li>Could I have the bill, please? (Можно счет, пожалуйста?)</li>
  </ul>
  <h3>Диалог:</h3>
  <p>Waiter: Good evening! Can I help you?<br>
  Customer: Yes, I would like to order a pizza.<br>
  Waiter: What kind of pizza would you like?<br>
  Customer: I would like a Margherita pizza, please.</p>',
  'beginner',
  4
);

-- 5. Грамматика: Present Continuous
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Present Continuous: Действия в процессе',
  '<h2>Present Continuous: Действия в процессе</h2>
  <p>Present Continuous используется для описания действий, происходящих в момент речи.</p>
  <h3>Образование:</h3>
  <p>am/is/are + глагол + ing</p>
  <h3>Примеры:</h3>
  <ul>
    <li>I am reading a book now. (Я читаю книгу сейчас)</li>
    <li>She is watching TV. (Она смотрит телевизор)</li>
    <li>They are playing football. (Они играют в футбол)</li>
  </ul>',
  'beginner',
  5
);

-- 6. Лексика: Путешествия
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Путешествия и транспорт',
  '<h2>Путешествия и транспорт</h2>
  <p>В этом уроке вы изучите слова, связанные с путешествиями и транспортом.</p>
  <h3>Основные слова:</h3>
  <ul>
    <li>airport (аэропорт)</li>
    <li>train station (вокзал)</li>
    <li>ticket (билет)</li>
    <li>passport (паспорт)</li>
    <li>luggage (багаж)</li>
  </ul>
  <h3>Упражнение:</h3>
  <p>Составьте рассказ о своем последнем путешествии, используя новые слова.</p>',
  'intermediate',
  6
);

-- 7. Грамматика: Future Simple
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Future Simple: Будущее время',
  '<h2>Future Simple: Будущее время</h2>
  <p>Future Simple используется для выражения будущих действий и намерений.</p>
  <h3>Образование:</h3>
  <p>will + глагол</p>
  <h3>Примеры:</h3>
  <ul>
    <li>I will call you tomorrow. (Я позвоню тебе завтра)</li>
    <li>She will visit her parents. (Она навестит своих родителей)</li>
    <li>They will not (won''t) come to the party. (Они не придут на вечеринку)</li>
  </ul>',
  'intermediate',
  7
);

-- 8. Практика: Телефонные разговоры
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Телефонные разговоры',
  '<h2>Телефонные разговоры</h2>
  <p>В этом уроке вы научитесь вести телефонные разговоры на английском.</p>
  <h3>Полезные фразы:</h3>
  <ul>
    <li>Hello, this is [name] speaking. (Здравствуйте, это [имя])</li>
    <li>Can I speak to [name], please? (Можно поговорить с [имя]?)</li>
    <li>I will call back later. (Я перезвоню позже)</li>
  </ul>
  <h3>Диалог:</h3>
  <p>A: Hello, this is John speaking.<br>
  B: Hi John, this is Mary. Can I speak to Tom, please?<br>
  A: I''m sorry, he''s not available right now.<br>
  B: Could you ask him to call me back?<br>
  A: Of course, I''ll give him the message.</p>',
  'intermediate',
  8
);

-- 9. Грамматика: Present Perfect
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Present Perfect: Связь прошлого с настоящим',
  '<h2>Present Perfect: Связь прошлого с настоящим</h2>
  <p>Present Perfect используется для выражения действий, которые произошли в прошлом, но имеют связь с настоящим.</p>
  <h3>Образование:</h3>
  <p>have/has + причастие прошедшего времени</p>
  <h3>Примеры:</h3>
  <ul>
    <li>I have finished my homework. (Я закончил домашнюю работу)</li>
    <li>She has visited Paris. (Она посетила Париж)</li>
    <li>They haven''t seen this movie. (Они не видели этот фильм)</li>
  </ul>',
  'advanced',
  9
);

-- 10. Лексика: Работа и карьера
INSERT INTO lessons (title, content, level, order_index) VALUES (
  'Работа и карьера',
  '<h2>Работа и карьера</h2>
  <p>В этом уроке вы изучите слова, связанные с работой и карьерой.</p>
  <h3>Основные слова:</h3>
  <ul>
    <li>job interview (собеседование)</li>
    <li>salary (зарплата)</li>
    <li>promotion (повышение)</li>
    <li>deadline (срок сдачи)</li>
    <li>colleague (коллега)</li>
  </ul>
  <h3>Упражнение:</h3>
  <p>Напишите рассказ о своей работе или карьерных целях, используя новые слова.</p>',
  'advanced',
  10
);

-- Создаем тесты для каждого урока

-- Тест для урока 1 (Present Simple)
INSERT INTO lesson_tests (lesson_id, title) VALUES (1, 'Тест по Present Simple');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Выберите правильное предложение в Present Simple:', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'She works in a bank.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'She working in a bank.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'She work in a bank.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (1, 'She is work in a bank.', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (1, 'Как образуется отрицание в Present Simple?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'do/does + not + глагол', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'am/is/are + not + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'will + not + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (2, 'have/has + not + глагол', false);

-- Тест для урока 2 (Семья и отношения)
INSERT INTO lesson_tests (lesson_id, title) VALUES (2, 'Тест по теме "Семья и отношения"');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (2, 'Как называется сестра вашего отца?', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'aunt', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'uncle', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'cousin', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (3, 'niece', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (2, 'Как называется сын вашего брата?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'nephew', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'cousin', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'uncle', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (4, 'brother-in-law', false);

-- Тест для урока 3 (Past Simple)
INSERT INTO lesson_tests (lesson_id, title) VALUES (3, 'Тест по Past Simple');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (3, 'Выберите правильную форму глагола "go" в Past Simple:', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'went', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'gone', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'goed', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (5, 'going', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (3, 'Как образуется отрицание в Past Simple?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'did not (didn''t) + глагол', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'was/were not + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'had not + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (6, 'will not + глагол', false);

-- Тест для урока 4 (Диалоги в ресторане)
INSERT INTO lesson_tests (lesson_id, title) VALUES (4, 'Тест по теме "Диалоги в ресторане"');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (4, 'Как правильно попросить меню?', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Can I see the menu, please?', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Give me menu!', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'I want menu.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (7, 'Menu, please.', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (4, 'Как правильно попросить счет?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'Could I have the bill, please?', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'Give me money!', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'I want pay.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (8, 'Money, please.', false);

-- Тест для урока 5 (Present Continuous)
INSERT INTO lesson_tests (lesson_id, title) VALUES (5, 'Тест по Present Continuous');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (5, 'Выберите правильное предложение в Present Continuous:', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'I am reading a book now.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'I reading a book now.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'I read a book now.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (9, 'I am read a book now.', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (5, 'Как образуется Present Continuous?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'am/is/are + глагол + ing', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'do/does + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'will + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (10, 'have/has + глагол', false);

-- Тест для урока 6 (Путешествия)
INSERT INTO lesson_tests (lesson_id, title) VALUES (6, 'Тест по теме "Путешествия"');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Что такое "boarding pass"?', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'посадочный талон', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'паспорт', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'виза', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (11, 'билет', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (6, 'Что такое "check-in"?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'регистрация на рейс', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'таможенный контроль', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'паспортный контроль', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (12, 'получение багажа', false);

-- Тест для урока 7 (Future Simple)
INSERT INTO lesson_tests (lesson_id, title) VALUES (7, 'Тест по Future Simple');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (7, 'Выберите правильное предложение в Future Simple:', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'I will call you tomorrow.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'I call you tomorrow.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'I am calling you tomorrow.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (13, 'I called you tomorrow.', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (7, 'Как образуется Future Simple?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'will + глагол', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'am/is/are + глагол + ing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'have/has + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (14, 'do/does + глагол', false);

-- Тест для урока 8 (Телефонные разговоры)
INSERT INTO lesson_tests (lesson_id, title) VALUES (8, 'Тест по теме "Телефонные разговоры"');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (8, 'Как правильно представиться по телефону?', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'Hello, this is John speaking.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'Hi, I am John.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'Hello, John here.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (15, 'Hi, my name John.', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (8, 'Как правильно попросить перезвонить?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'Could you call me back?', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'Call me!', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'I want you call me.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (16, 'Call me back, please.', false);

-- Тест для урока 9 (Present Perfect)
INSERT INTO lesson_tests (lesson_id, title) VALUES (9, 'Тест по Present Perfect');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (9, 'Выберите правильное предложение в Present Perfect:', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'I have finished my homework.', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'I finished my homework.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'I am finishing my homework.', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (17, 'I finish my homework.', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (9, 'Как образуется Present Perfect?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'have/has + причастие прошедшего времени', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'am/is/are + глагол + ing', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'will + глагол', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (18, 'do/does + глагол', false);

-- Тест для урока 10 (Работа и карьера)
INSERT INTO lesson_tests (lesson_id, title) VALUES (10, 'Тест по теме "Работа и карьера"');

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (10, 'Что такое "deadline"?', 1);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'срок сдачи работы', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'начало рабочего дня', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'обеденный перерыв', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (19, 'конец рабочего дня', false);

INSERT INTO lesson_questions (test_id, text, order_number) VALUES (10, 'Что такое "promotion"?', 2);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'повышение по службе', true);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'увольнение', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'отпуск', false);
INSERT INTO lesson_options (question_id, text, is_correct) VALUES (20, 'больничный', false); 