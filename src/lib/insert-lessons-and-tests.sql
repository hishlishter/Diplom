-- Добавляем уроки

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

-- Добавляем тесты

-- 1. Тест по Present Simple
INSERT INTO tests (id, title, description, level) VALUES (
  1,
  'Тест по Present Simple',
  'Проверьте свои знания по теме Present Simple',
  'beginner'
);

-- Вопросы для теста по Present Simple
INSERT INTO questions (test_id, text, order_number) VALUES (1, 'Выберите правильное предложение в Present Simple:', 1);
INSERT INTO options (question_id, text, is_correct) VALUES (1, 'She works in a bank.', true);
INSERT INTO options (question_id, text, is_correct) VALUES (1, 'She working in a bank.', false);
INSERT INTO options (question_id, text, is_correct) VALUES (1, 'She work in a bank.', false);
INSERT INTO options (question_id, text, is_correct) VALUES (1, 'She is work in a bank.', false);

INSERT INTO questions (test_id, text, order_number) VALUES (1, 'Как образуется отрицание в Present Simple?', 2);
INSERT INTO options (question_id, text, is_correct) VALUES (2, 'do/does + not + глагол', true);
INSERT INTO options (question_id, text, is_correct) VALUES (2, 'am/is/are + not + глагол', false);
INSERT INTO options (question_id, text, is_correct) VALUES (2, 'will + not + глагол', false);
INSERT INTO options (question_id, text, is_correct) VALUES (2, 'have/has + not + глагол', false);

-- 2. Тест по Past Simple
INSERT INTO tests (id, title, description, level) VALUES (
  2,
  'Тест по Past Simple',
  'Проверьте свои знания по теме Past Simple',
  'intermediate'
);

-- Вопросы для теста по Past Simple
INSERT INTO questions (test_id, text, order_number) VALUES (2, 'Выберите правильную форму глагола "go" в Past Simple:', 1);
INSERT INTO options (question_id, text, is_correct) VALUES (3, 'went', true);
INSERT INTO options (question_id, text, is_correct) VALUES (3, 'gone', false);
INSERT INTO options (question_id, text, is_correct) VALUES (3, 'goed', false);
INSERT INTO options (question_id, text, is_correct) VALUES (3, 'going', false);

INSERT INTO questions (test_id, text, order_number) VALUES (2, 'Как образуется отрицание в Past Simple?', 2);
INSERT INTO options (question_id, text, is_correct) VALUES (4, 'did not (didn''t) + глагол', true);
INSERT INTO options (question_id, text, is_correct) VALUES (4, 'was/were not + глагол', false);
INSERT INTO options (question_id, text, is_correct) VALUES (4, 'had not + глагол', false);
INSERT INTO options (question_id, text, is_correct) VALUES (4, 'will not + глагол', false);

-- 3. Тест по Present Continuous
INSERT INTO tests (id, title, description, level) VALUES (
  3,
  'Тест по Present Continuous',
  'Проверьте свои знания по теме Present Continuous',
  'beginner'
);

-- Вопросы для теста по Present Continuous
INSERT INTO questions (test_id, text, order_number) VALUES (3, 'Выберите правильное предложение в Present Continuous:', 1);
INSERT INTO options (question_id, text, is_correct) VALUES (5, 'I am reading a book now.', true);
INSERT INTO options (question_id, text, is_correct) VALUES (5, 'I reading a book now.', false);
INSERT INTO options (question_id, text, is_correct) VALUES (5, 'I read a book now.', false);
INSERT INTO options (question_id, text, is_correct) VALUES (5, 'I am read a book now.', false);

INSERT INTO questions (test_id, text, order_number) VALUES (3, 'Как образуется Present Continuous?', 2);
INSERT INTO options (question_id, text, is_correct) VALUES (6, 'am/is/are + глагол + ing', true);
INSERT INTO options (question_id, text, is_correct) VALUES (6, 'do/does + глагол', false);
INSERT INTO options (question_id, text, is_correct) VALUES (6, 'will + глагол', false);
INSERT INTO options (question_id, text, is_correct) VALUES (6, 'have/has + глагол', false);

-- 4. Тест по лексике: Семья
INSERT INTO tests (id, title, description, level) VALUES (
  4,
  'Тест по теме "Семья и отношения"',
  'Проверьте свои знания слов, связанных с семьей и отношениями',
  'beginner'
);

-- Вопросы для теста по лексике: Семья
INSERT INTO questions (test_id, text, order_number) VALUES (4, 'Как называется сестра вашего отца?', 1);
INSERT INTO options (question_id, text, is_correct) VALUES (7, 'aunt', true);
INSERT INTO options (question_id, text, is_correct) VALUES (7, 'uncle', false);
INSERT INTO options (question_id, text, is_correct) VALUES (7, 'cousin', false);
INSERT INTO options (question_id, text, is_correct) VALUES (7, 'niece', false);

INSERT INTO questions (test_id, text, order_number) VALUES (4, 'Как называется сын вашего брата?', 2);
INSERT INTO options (question_id, text, is_correct) VALUES (8, 'nephew', true);
INSERT INTO options (question_id, text, is_correct) VALUES (8, 'cousin', false);
INSERT INTO options (question_id, text, is_correct) VALUES (8, 'uncle', false);
INSERT INTO options (question_id, text, is_correct) VALUES (8, 'brother-in-law', false);

-- 5. Тест по диалогам в ресторане
INSERT INTO tests (id, title, description, level) VALUES (
  5,
  'Тест по теме "Диалоги в ресторане"',
  'Проверьте свои знания фраз для общения в ресторане',
  'beginner'
);

-- Вопросы для теста по диалогам в ресторане
INSERT INTO questions (test_id, text, order_number) VALUES (5, 'Как правильно попросить меню?', 1);
INSERT INTO options (question_id, text, is_correct) VALUES (9, 'Can I see the menu, please?', true);
INSERT INTO options (question_id, text, is_correct) VALUES (9, 'Give me menu!', false);
INSERT INTO options (question_id, text, is_correct) VALUES (9, 'I want menu.', false);
INSERT INTO options (question_id, text, is_correct) VALUES (9, 'Menu, please.', false);

INSERT INTO questions (test_id, text, order_number) VALUES (5, 'Как правильно попросить счет?', 2);
INSERT INTO options (question_id, text, is_correct) VALUES (10, 'Could I have the bill, please?', true);
INSERT INTO options (question_id, text, is_correct) VALUES (10, 'Give me money!', false);
INSERT INTO options (question_id, text, is_correct) VALUES (10, 'I want pay.', false);
INSERT INTO options (question_id, text, is_correct) VALUES (10, 'Money, please.', false); 