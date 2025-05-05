-- Очищаем таблицы в правильном порядке (с учетом внешних ключей)
TRUNCATE TABLE options CASCADE;
TRUNCATE TABLE questions CASCADE;
TRUNCATE TABLE test_results CASCADE;
TRUNCATE TABLE tests CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;

-- Сбрасываем счетчики прогресса у пользователей
UPDATE profiles 
SET tests_completed = 0, 
    lessons_completed = 0; 