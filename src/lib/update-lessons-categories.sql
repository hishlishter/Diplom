-- Сначала добавим колонку category, если её ещё нет
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS category VARCHAR(20) NOT NULL DEFAULT 'grammar';

-- Обновим категории для существующих уроков
UPDATE lessons
SET category = 'grammar'
WHERE title LIKE '%Simple%'
   OR title LIKE '%Continuous%'
   OR title LIKE '%Perfect%'
   OR title LIKE '%Tense%'
   OR title LIKE '%Passive%'
   OR title LIKE '%Conditional%';

UPDATE lessons
SET category = 'vocabulary'
WHERE title LIKE '%Words%'
   OR title LIKE '%Vocabulary%'
   OR title LIKE '%Synonyms%'
   OR title LIKE '%Antonyms%'
   OR title LIKE '%Topic:%';

UPDATE lessons
SET category = 'phrases'
WHERE title LIKE '%Idioms%'
   OR title LIKE '%Phrasal%'
   OR title LIKE '%Expressions%'
   OR title LIKE '%Collocations%'
   OR title LIKE '%Sayings%';

-- Добавим ограничение NOT NULL после обновления данных
ALTER TABLE lessons ALTER COLUMN category SET NOT NULL; 