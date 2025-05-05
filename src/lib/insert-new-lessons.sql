-- Очищаем старые данные
TRUNCATE TABLE lesson_options CASCADE;
TRUNCATE TABLE lesson_questions CASCADE;
TRUNCATE TABLE lesson_tests CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- === ГРАММАТИКА ===

-- 1. Present Simple
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Present Simple: Основы',
    '<h2>Present Simple — время твоих привычек и суперсил!</h2>
    <p>Ты хочешь рассказать, что делаешь каждый день? Или поделиться своим расписанием? <b>Present Simple</b> — твой верный помощник!</p>
    <div style="background:#f3e8ff;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Формула:</b> <br>
      Подлежащее + глагол (для he/she/it — +s)
    </div>
    <ul>
      <li><b>I play</b> football every Sunday. — Я играю в футбол каждое воскресенье.</li>
      <li><b>She reads</b> books in the evening. — Она читает книги вечером.</li>
      <li><b>We don''t like</b> broccoli. — Мы не любим брокколи.</li>
    </ul>
    <h3>Лайфхак:</h3>
    <p>Добавляй <b>-s</b> к глаголу только для <b>he/she/it</b>!<br>
    <span style="color:#a21caf;">He works, she dances, it rains.</span></p>
    <h3>Когда использовать?</h3>
    <ul>
      <li>Регулярные действия: <i>I go to school every day.</i></li>
      <li>Факты: <i>The sun rises in the east.</i></li>
      <li>Расписания: <i>The train leaves at 7.</i></li>
    </ul>
    <div style="background:#fef9c3;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      Do/Does + подлежащее + глагол? <br>
      <i>Do you like pizza?</i> — Ты любишь пиццу?<br>
      <i>Does she play tennis?</i> — Она играет в теннис?</div>
    <h3>Попробуй сам!</h3>
    <p>Опиши свой день на английском с помощью Present Simple. Ты удивишься, как это просто и весело!</p>',
    'beginner', 1, 'grammar'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по Present Simple')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Выберите правильное предложение:', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как образуется отрицание?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'She works every day.', true),
  ((SELECT id FROM q1), 'She work every day.', false),
  ((SELECT id FROM q1), 'She working every day.', false),
  ((SELECT id FROM q2), 'do/does + not + глагол', true),
  ((SELECT id FROM q2), 'am/is/are + not + глагол', false),
  ((SELECT id FROM q2), 'will + not + глагол', false);

-- 2. Past Simple
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Past Simple: Приключения в прошлом',
    '<h2>Past Simple — машина времени!</h2>
    <p>Хочешь рассказать о приключениях, которые уже случились? <b>Past Simple</b> переносит тебя в прошлое!</p>
    <div style="background:#fee2e2;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Формула:</b> <br>
      Подлежащее + глагол в прошедшей форме (V2)
    </div>
    <ul>
      <li><b>I visited</b> London last year. — Я посетил Лондон в прошлом году.</li>
      <li><b>She didn''t eat</b> breakfast. — Она не позавтракала.</li>
      <li><b>Did you see</b> this movie? — Ты видел этот фильм?</li>
    </ul>
    <h3>Совет:</h3>
    <p>Запомни неправильные глаголы — это твой ключ к свободному рассказу о прошлом!</p>
    <div style="background:#fef9c3;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      <i>What did you do yesterday?</i> — Что ты делал вчера?</div>
    <h3>Challenge!</h3>
    <p>Напиши короткую историю о своём самом ярком дне!</p>',
    'beginner', 2, 'grammar'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по Past Simple')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Выбери правильную форму глагола для Past Simple:', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как образуется вопрос?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'went', true),
  ((SELECT id FROM q1), 'goed', false),
  ((SELECT id FROM q1), 'goes', false),
  ((SELECT id FROM q2), 'Did + подлежащее + глагол', true),
  ((SELECT id FROM q2), 'Do + подлежащее + глагол', false),
  ((SELECT id FROM q2), 'Was + подлежащее + глагол', false);

-- 3. Future Simple
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Future Simple: Мечты о будущем',
    '<h2>Future Simple — твои планы и мечты!</h2>
    <p>Хочешь рассказать, что будет завтра? <b>Future Simple</b> — твой билет в будущее!</p>
    <div style="background:#dbeafe;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Формула:</b> <br>
      will + глагол
    </div>
    <ul>
      <li><b>I will travel</b> to Japan. — Я поеду в Японию.</li>
      <li><b>Will you help</b> me? — Ты поможешь мне?</li>
      <li><b>She won''t forget</b> this day. — Она не забудет этот день.</li>
    </ul>
    <h3>Совет:</h3>
    <p>Используй Future Simple для обещаний, предсказаний и спонтанных решений!</p>
    <div style="background:#fef9c3;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      <i>What will you do next summer?</i> — Что ты будешь делать следующим летом?</div>
    <h3>Challenge!</h3>
    <p>Составь список своих мечт на английском!</p>',
    'beginner', 3, 'grammar'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по Future Simple')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как образуется отрицание в Future Simple?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Выбери правильное предложение:', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'will not (won''t) + глагол', true),
  ((SELECT id FROM q1), 'do not + глагол', false),
  ((SELECT id FROM q1), 'am not + глагол', false),
  ((SELECT id FROM q2), 'I will visit my friend.', true),
  ((SELECT id FROM q2), 'I visits my friend.', false),
  ((SELECT id FROM q2), 'I am visit my friend.', false);

-- === ЛЕКСИКА ===

-- 1. Семья и отношения
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Семья и отношения',
    '<h2>Семья — твой мир на английском!</h2>
    <p>Семья — это не только родные, но и друзья, и даже любимые питомцы! Давай выучим самые тёплые слова:</p>
    <div style="background:#d1fae5;padding:1em;border-radius:1em;margin:1em 0;">
      <b>mother</b> — мама <br>
      <b>father</b> — папа <br>
      <b>sister</b> — сестра <br>
      <b>brother</b> — брат <br>
      <b>grandmother</b> — бабушка <br>
      <b>grandfather</b> — дедушка <br>
      <b>uncle</b> — дядя <br>
      <b>aunt</b> — тётя <br>
      <b>cousin</b> — двоюродный брат/сестра <br>
      <b>pet</b> — домашний питомец
    </div>
    <h3>Мини-история:</h3>
    <p><i>My family is big. I have a sister and a brother. My grandmother bakes the best pies!</i></p>
    <h3>Совет:</h3>
    <p>Сделай мини-альбом: нарисуй свою семью и подпиши всех на английском. Это весело и очень помогает запомнить слова!</p>
    <div style="background:#fef3c7;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос для тебя:</b> <br>
      <i>Who is the funniest person in your family?</i> — Кто самый весёлый в твоей семье?</div>
    <h3>Challenge!</h3>
    <p>Попробуй рассказать о своей семье другу на английском. Ты сможешь!</p>',
    'beginner', 4, 'vocabulary'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по теме Семья')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как по-английски "мать"?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Выберите слово, обозначающее "брат"', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'mother', true),
  ((SELECT id FROM q1), 'father', false),
  ((SELECT id FROM q1), 'sister', false),
  ((SELECT id FROM q2), 'brother', true),
  ((SELECT id FROM q2), 'grandfather', false),
  ((SELECT id FROM q2), 'uncle', false);

-- 2. Путешествия
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Путешествия и открытия',
    '<h2>Путешествия — твой путь к приключениям!</h2>
    <p>Слова, которые пригодятся в любой поездке:</p>
    <div style="background:#e0f2fe;padding:1em;border-radius:1em;margin:1em 0;">
      <b>airport</b> — аэропорт <br>
      <b>ticket</b> — билет <br>
      <b>luggage</b> — багаж <br>
      <b>hotel</b> — отель <br>
      <b>map</b> — карта
    </div>
    <h3>Совет:</h3>
    <p>Сделай список must-have слов для своей следующей поездки!</p>
    <div style="background:#fef9c3;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      <i>What is your dream country to visit?</i> — В какую страну ты мечтаешь поехать?</div>
    <h3>Challenge!</h3>
    <p>Опиши своё идеальное путешествие на английском!</p>',
    'beginner', 5, 'vocabulary'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по теме Путешествия')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как по-английски "аэропорт"?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Что значит "luggage"?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'airport', true),
  ((SELECT id FROM q1), 'hotel', false),
  ((SELECT id FROM q1), 'ticket', false),
  ((SELECT id FROM q2), 'багаж', true),
  ((SELECT id FROM q2), 'билет', false),
  ((SELECT id FROM q2), 'карта', false);

-- 3. Еда и напитки
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Еда и напитки',
    '<h2>Еда — вкусный английский!</h2>
    <p>Слова, которые пригодятся в кафе, ресторане и дома:</p>
    <div style="background:#fef3c7;padding:1em;border-radius:1em;margin:1em 0;">
      <b>breakfast</b> — завтрак <br>
      <b>lunch</b> — обед <br>
      <b>dinner</b> — ужин <br>
      <b>juice</b> — сок <br>
      <b>bread</b> — хлеб
    </div>
    <h3>Совет:</h3>
    <p>Попробуй заказать блюдо на английском в кафе!</p>
    <div style="background:#fef9c3;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      <i>What is your favorite food?</i> — Какое твоё любимое блюдо?</div>
    <h3>Challenge!</h3>
    <p>Составь меню для воображаемого ресторана на английском!</p>',
    'beginner', 6, 'vocabulary'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по теме Еда')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как по-английски "завтрак"?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Что значит "juice"?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'breakfast', true),
  ((SELECT id FROM q1), 'lunch', false),
  ((SELECT id FROM q1), 'dinner', false),
  ((SELECT id FROM q2), 'сок', true),
  ((SELECT id FROM q2), 'хлеб', false),
  ((SELECT id FROM q2), 'обед', false);

-- === УСТОЙЧИВЫЕ ВЫРАЖЕНИЯ ===

-- 1. Приветствия и прощания
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Приветствия и прощания',
    '<h2>Приветствия — ключ к новым знакомствам!</h2>
    <p>Слово <b>Hello!</b> открывает двери в любой компании. А <b>Goodbye!</b> — оставляет о тебе хорошее впечатление.</p>
    <div style="background:#e0e7ff;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Самые нужные фразы:</b><br>
      <b>Hello!</b> — Здравствуйте!<br>
      <b>Hi!</b> — Привет!<br>
      <b>Good morning!</b> — Доброе утро!<br>
      <b>Goodbye!</b> — До свидания!<br>
      <b>See you!</b> — Увидимся!<br>
      <b>Take care!</b> — Береги себя!
    </div>
    <h3>Ситуация из жизни:</h3>
    <p><i>You: Hello!<br>New friend: Hi! How are you?<br>You: I''m great, thank you! And you?</i></p>
    <h3>Совет:</h3>
    <p>Улыбка и простое "Hello!" могут завести новое знакомство даже в другой стране!</p>
    <div style="background:#fef3c7;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Попробуй:</b> <br>
      Поздоровайся с кем-нибудь на английском сегодня!</div>
    <h3>Challenge!</h3>
    <p>Сделай видео, где ты здороваешься и прощаешься на английском. Это весело и очень полезно!</p>',
    'beginner', 7, 'phrases'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по теме Приветствия')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как сказать "Здравствуйте" на английском?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как по-английски "До свидания"?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'Hello', true),
  ((SELECT id FROM q1), 'Thanks', false),
  ((SELECT id FROM q1), 'Sorry', false),
  ((SELECT id FROM q2), 'Goodbye', true),
  ((SELECT id FROM q2), 'Please', false),
  ((SELECT id FROM q2), 'Welcome', false);

-- 2. Благодарности и извинения
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Благодарности и извинения',
    '<h2>Thank you & Sorry — слова, которые делают мир добрее!</h2>
    <p>Вежливость — твой ключ к сердцам людей. Используй эти фразы каждый день:</p>
    <div style="background:#fef3c7;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Thank you!</b> — Спасибо!<br>
      <b>Thanks a lot!</b> — Большое спасибо!<br>
      <b>Sorry!</b> — Прости!<br>
      <b>Excuse me!</b> — Извините!<br>
      <b>No problem!</b> — Ничего страшного!
    </div>
    <h3>Совет:</h3>
    <p>Скажи "Thank you" сегодня хотя бы трём людям!</p>
    <div style="background:#e0e7ff;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      <i>When do you say sorry?</i> — Когда ты говоришь "прости"?</div>
    <h3>Challenge!</h3>
    <p>Сделай комплимент другу на английском и поблагодари его!</p>',
    'beginner', 8, 'phrases'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по теме Благодарности')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как сказать "Спасибо" на английском?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Что значит "Excuse me"?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'Thank you', true),
  ((SELECT id FROM q1), 'Sorry', false),
  ((SELECT id FROM q1), 'Welcome', false),
  ((SELECT id FROM q2), 'Извините', true),
  ((SELECT id FROM q2), 'Пожалуйста', false),
  ((SELECT id FROM q2), 'До свидания', false);

-- 3. Пожелания и поздравления
WITH l AS (
  INSERT INTO lessons (title, content, level, order_index, category)
  VALUES (
    'Пожелания и поздравления',
    '<h2>Поздравления и пожелания — делай мир радостнее!</h2>
    <p>Сделай чей-то день ярче с помощью этих фраз:</p>
    <div style="background:#d1fae5;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Congratulations!</b> — Поздравляю!<br>
      <b>Happy birthday!</b> — С днём рождения!<br>
      <b>Good luck!</b> — Удачи!<br>
      <b>Best wishes!</b> — Всего наилучшего!<br>
      <b>Have a nice day!</b> — Хорошего дня!
    </div>
    <h3>Совет:</h3>
    <p>Поздравь кого-нибудь на английском сегодня!</p>
    <div style="background:#fef9c3;padding:1em;border-radius:1em;margin:1em 0;">
      <b>Вопрос:</b> <br>
      <i>When do you say ''Good luck''?</i> — Когда ты желаешь удачи?</div>
    <h3>Challenge!</h3>
    <p>Сделай открытку с пожеланием на английском!</p>',
    'beginner', 9, 'phrases'
  )
  RETURNING id
), t AS (
  INSERT INTO lesson_tests (lesson_id, title)
  VALUES ((SELECT id FROM l), 'Тест по теме Пожелания')
  RETURNING id
), q1 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Как по-английски "Поздравляю"?', 1)
  RETURNING id
), q2 AS (
  INSERT INTO lesson_questions (test_id, text, order_number)
  VALUES ((SELECT id FROM t), 'Что значит "Best wishes"?', 2)
  RETURNING id
)
INSERT INTO lesson_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM q1), 'Congratulations', true),
  ((SELECT id FROM q1), 'Goodbye', false),
  ((SELECT id FROM q1), 'Sorry', false),
  ((SELECT id FROM q2), 'Всего наилучшего', true),
  ((SELECT id FROM q2), 'С днём рождения', false),
  ((SELECT id FROM q2), 'Удачи', false); 