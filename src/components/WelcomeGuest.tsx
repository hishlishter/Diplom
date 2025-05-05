import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WelcomeGuest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] transition-colors duration-300 relative overflow-hidden">
      {/* Анимированные градиенты */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 rounded-full opacity-30 blur-3xl animate-blob z-0 dark:from-purple-900 dark:via-fuchsia-900 dark:to-indigo-900" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 rounded-full opacity-20 blur-2xl animate-blob animation-delay-2000 z-0 dark:from-fuchsia-900 dark:via-purple-900 dark:to-indigo-900" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-indigo-200 via-pink-200 to-purple-200 rounded-full opacity-20 blur-2xl animate-blob animation-delay-4000 z-0 dark:from-indigo-900 dark:via-fuchsia-900 dark:to-purple-900" />
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto py-16">
        {/* Логотип MarGO как в Sidebar */}
        <div className="flex justify-center items-center mb-8 select-none">
          <h1 className="text-4xl md:text-5xl font-extrabold font-[Playfair_Display] tracking-tight bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg shadow-fuchsia-300/40 transition-all duration-500 animate-glow dark:from-fuchsia-400 dark:via-purple-400 dark:to-indigo-400 dark:shadow-fuchsia-700/40">
            MarGO
          </h1>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center leading-tight dark:text-purple-100">Учите английский бесплатно,<br />красиво и эффективно!</h1>
        <div className="flex flex-col gap-4 w-full mb-8 max-w-md mx-auto">
          <Button onClick={() => navigate('/auth')} className="w-full py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 rounded-xl shadow-lg transition-all dark:from-fuchsia-700 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-fuchsia-700">Начать</Button>
          <Button variant="outline" onClick={() => navigate('/auth')} className="w-full py-3 text-lg font-bold border-2 border-pink-300 text-purple-700 rounded-xl shadow-md transition-all dark:border-fuchsia-400 dark:text-fuchsia-200">У меня уже есть аккаунт</Button>
        </div>
        <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col gap-3 dark:bg-[#232136] dark:text-purple-100 dark:border-[#393552] max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-purple-700 mb-2 text-center dark:text-fuchsia-300">Почему MarGO?</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <span className="text-xl">🎨</span>
              <span className="text-gray-700 dark:text-purple-100">Современный и красивый интерфейс</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🏆</span>
              <span className="text-gray-700 dark:text-purple-100">Достижения и мотивация</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🧩</span>
              <span className="text-gray-700 dark:text-purple-100">Интерактивные уроки и тесты</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <span className="text-gray-700 dark:text-purple-100">Безопасность и приватность</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <span className="text-gray-700 dark:text-purple-100">Постоянное развитие</span>
            </li>
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 12px #f0abfc, 0 0 24px #a78bfa; }
          50% { text-shadow: 0 0 24px #f0abfc, 0 0 48px #a78bfa; }
        }
        .animate-glow { animation: glow 2.5s infinite alternate; }
      `}</style>
    </div>
  );
};

export default WelcomeGuest; 