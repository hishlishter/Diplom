import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeGuest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f]">
      {/* Логотип MarGO */}
      <div className="flex justify-center items-center py-8 select-none">
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl animate-glow">🔥</span>
          <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg font-[Playfair_Display] tracking-tight">MarGO</span>
        </div>
      </div>
      {/* Основной контент */}
      <div className="flex flex-1 items-center justify-center px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12 md:gap-24 animate-fade-in">
          {/* Иллюстрация/маскот */}
          <div className="relative flex items-center justify-center mb-8 md:mb-0">
            {/* Декоративные элементы вокруг котика */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl animate-bounce-slow">🌸</span>
            <span className="absolute bottom-0 -left-8 text-2xl animate-twinkle">✨</span>
            <span className="absolute top-8 -right-8 text-2xl animate-twinkle delay-200">🗨️</span>
            <span className="absolute bottom-8 right-1/2 translate-x-1/2 text-2xl animate-twinkle delay-300">⭐</span>
            {/* Круглый фон и рамка */}
            <div className="rounded-full bg-white/90 shadow-2xl p-3 md:p-6 border-4 border-transparent bg-clip-padding animate-float"
                 style={{
                   borderImage: 'linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #818cf8 100%) 1',
                   boxShadow: '0 8px 32px 0 rgba(130, 90, 255, 0.15), 0 1.5px 8px 0 #fbcfe8'
                 }}>
              <img
                src="/assets/cat-mascot.png"
                alt="Мультяшный котик"
                className="h-40 w-40 md:h-56 md:w-56 object-contain rounded-full animate-pop"
                draggable={false}
                style={{ background: 'white', borderRadius: '50%' }}
              />
            </div>
            {/* Языковые пузырьки (пример, можно добавить больше) */}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/80 rounded-full px-3 py-1 text-xs font-bold text-purple-500 shadow animate-fade-in-slow">Hello! ¡Hola! Bonjour!</span>
          </div>
          {/* Правая колонка: текст и кнопки */}
          <div className="flex flex-col items-center md:items-start max-w-md w-full">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 text-center md:text-left leading-tight">Учите английский бесплатно,<br />красиво и эффективно!</h1>
            <div className="flex flex-col gap-4 w-full mb-8">
              <Button onClick={() => navigate('/auth')} className="w-full py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 rounded-xl shadow-lg transition-all">Начать</Button>
              <Button variant="outline" onClick={() => navigate('/auth')} className="w-full py-3 text-lg font-bold border-2 border-pink-300 text-purple-700 rounded-xl shadow-md transition-all">У меня уже есть аккаунт</Button>
            </div>
            <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-purple-700 mb-2 text-center md:text-left">Почему MarGO?</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <span className="text-xl">🎨</span>
                  <span className="text-gray-700">Современный и красивый интерфейс</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <span className="text-gray-700">Достижения и мотивация</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🧩</span>
                  <span className="text-gray-700">Интерактивные уроки и тесты</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <span className="text-gray-700">Безопасность и приватность</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🚀</span>
                  <span className="text-gray-700">Постоянное развитие</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuest; 