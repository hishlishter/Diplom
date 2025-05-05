import React, { useEffect, useRef, useState } from 'react';
import { Award, Flame, Star, Trophy, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';

interface AchievementsDashboardProps {
  totalCompletedTests: number;
  totalCompletedLessons: number;
  streak: number;
  hasPerfectTest: boolean;
}

const achievements = [
  {
    icon: <Award className="text-blue-500" size={32} />, title: 'Зарегистрироваться',
    description: 'Поздравляем с регистрацией! Добро пожаловать в MarGO.'
  },
  {
    icon: <CheckCircle className="text-green-500" size={32} />, title: 'Первый урок',
    description: 'Вы успешно завершили свой первый урок!'
  },
  {
    icon: <Trophy className="text-yellow-500" size={32} />, title: 'Первый тест',
    description: 'Вы прошли свой первый тест!'
  },
  {
    icon: <Star className="text-purple-500" size={32} />, title: '5 уроков',
    description: 'Вы завершили 5 уроков!'
  },
  {
    icon: <Flame className="text-pink-500" size={32} />, title: '3 теста',
    description: 'Вы прошли 3 теста!'
  },
];

const currentLevel = 1;
const totalAchievements = achievements.length;

const AchievementsDashboard: React.FC<AchievementsDashboardProps> = ({
  totalCompletedTests,
  totalCompletedLessons,
  streak,
  hasPerfectTest
}) => {
  // Новая логика достижений по пропсам
  const hasRegistered = true; // если компонент виден — пользователь зарегистрирован
  const hasFirstLesson = totalCompletedLessons > 0;
  const hasFirstTest = totalCompletedTests > 0;
  const hasFiveLessons = totalCompletedLessons >= 5;
  const hasThreeTests = totalCompletedTests >= 3;

  const unlockedAchievements = [
    hasRegistered,
    hasFirstLesson,
    hasFirstTest,
    hasFiveLessons,
    hasThreeTests
  ];
  const unlockedCount = unlockedAchievements.filter(Boolean).length;

  // --- Исправление сброса достижений ---
  // Получаем userId из localStorage профиля (если есть)
  let userId = '';
  try {
    const cachedProfile = localStorage.getItem('profile_' + (window?.supabaseUserId || ''));
    if (cachedProfile) {
      const parsed = JSON.parse(cachedProfile);
      userId = parsed.id || '';
    }
  } catch {}
  // Ключ для хранения prevUnlocked
  const prevUnlockedKey = `achievements_prevUnlocked_${userId}`;
  // Получаем prevUnlocked из localStorage или инициализируем
  const getPrevUnlocked = () => {
    const stored = localStorage.getItem(prevUnlockedKey);
    return stored ? parseInt(stored, 10) : unlockedCount;
  };
  const setPrevUnlocked = (val: number) => {
    localStorage.setItem(prevUnlockedKey, String(val));
  };
  const [showConfetti, setShowConfetti] = useState(false);
  const prevUnlocked = useRef(getPrevUnlocked());
  useEffect(() => {
    // Если данных нет — не сбрасываем достижения
    if (unlockedCount === 0) return;
    // Если стало больше — показываем анимацию и уведомление
    if (unlockedCount > prevUnlocked.current) {
      setShowConfetti(true);
      const idx = unlockedAchievements.findIndex((v, i) => v && !unlockedAchievements.slice(0, i).every(Boolean));
      toast.success('Новое достижение!', {
        description: achievements[idx]?.title || 'Поздравляем!'
      });
      setTimeout(() => setShowConfetti(false), 3500);
      prevUnlocked.current = unlockedCount;
      setPrevUnlocked(unlockedCount);
    } else if (unlockedCount < prevUnlocked.current) {
      // Если стало меньше — не сбрасываем, оставляем прежнее значение
      // (например, если данные временно не пришли)
      // ничего не делаем
    }
    // Если не изменилось — ничего не делаем
  }, [unlockedCount]);

  return (
    <div className="relative bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl w-full max-w-2xl mx-auto mt-8 overflow-hidden dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] dark:shadow-purple-900/40 dark:border dark:border-[#393552]">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={350} recycle={false} gravity={0.25} />}
      <h2 className="text-2xl font-extrabold mb-2 text-gray-900 tracking-tight dark:text-purple-100">Ваши достижения</h2>
      <p className="text-muted-foreground mb-6 dark:text-purple-300">Собирайте бейджи, чтобы повышать свой уровень и получать награды!</p>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400" style={{ width: `${Math.round((unlockedCount / totalAchievements) * 100)}%` }} />
        </div>
        <span className="ml-2 text-sm font-semibold text-purple-700">{Math.round((unlockedCount / totalAchievements) * 100)}%</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {achievements.map((ach, idx) => (
          <div key={ach.title} className={`flex items-center gap-4 p-4 rounded-xl shadow transition-all duration-300 ${unlockedAchievements[idx] ? 'bg-white/90 border-2 border-purple-200 dark:bg-[#232136] dark:border-[#393552]' : 'bg-gray-100/60 opacity-60 dark:bg-[#232136]/60 dark:border-[#393552]/60'}`}>
            <div>{ach.icon}</div>
            <div>
              <div className={`font-bold text-lg ${unlockedAchievements[idx] ? 'text-purple-800 dark:text-purple-100' : 'text-gray-400 dark:text-purple-400'}`}>{ach.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{ach.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground dark:text-purple-300">
        Уровень: <span className="font-bold text-purple-700">{currentLevel}</span> &nbsp;|&nbsp; Открыто достижений: <span className="font-bold text-purple-700">{unlockedCount}</span> из {totalAchievements}
      </div>
    </div>
  );
};

export default AchievementsDashboard; 