import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, BookOpen, Brain, Settings, LogOut, Home, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, signOut, supabaseInitialized } = useAuth();

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to sign out user:', user?.id);
      await signOut();
      // Toast is shown in signOut function
    } catch (error) {
      console.error('Logout error in sidebar:', error);
      toast.error('Ошибка при выходе из системы');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="relative min-h-screen w-64 flex flex-col py-8 px-5 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 shadow-2xl overflow-hidden dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] dark:shadow-purple-900/40 dark:text-purple-100 transition-colors duration-300">
      {/* Декоративные блёстки */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-10 top-10 w-2 h-2 bg-white/70 rounded-full blur-sm animate-pulse dark:bg-fuchsia-400/60" />
        <div className="absolute right-8 top-24 w-3 h-3 bg-pink-300/60 rounded-full blur-md animate-pulse dark:bg-fuchsia-700/60" />
        <div className="absolute left-1/2 bottom-10 w-1.5 h-1.5 bg-purple-300/60 rounded-full blur-sm animate-pulse dark:bg-indigo-400/60" />
        <div className="absolute right-6 bottom-20 w-2 h-2 bg-indigo-200/80 rounded-full blur-md animate-pulse dark:bg-indigo-700/80" />
      </div>
      {/* Название */}
      <div className="flex justify-center mb-10 z-10">
        <Link to="/" className="flex flex-col items-center group select-none">
          <div className="relative flex items-center justify-center">
            {/* Светящиеся круги и sparkles */}
            <span className="absolute -left-8 top-2 w-10 h-10 bg-fuchsia-400/30 rounded-full blur-2xl animate-pulse" />
            <span className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 bg-purple-300/40 rounded-full blur-md animate-twinkle" />
            <span className="absolute left-1/2 -translate-x-1/2 top-8 w-2 h-2 bg-pink-400/60 rounded-full blur-[2px] animate-twinkle delay-200" />
            <h1 className="text-5xl font-extrabold font-[Playfair_Display] tracking-tight bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg shadow-fuchsia-300/40 transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-2xl dark:from-fuchsia-400 dark:via-purple-300 dark:to-indigo-400 dark:shadow-fuchsia-700/40">
              Mar<span className="text-6xl animate-glow">GO</span>
            </h1>
            <span className="absolute -right-8 top-2 w-10 h-10 bg-indigo-400/30 rounded-full blur-2xl animate-pulse delay-200" />
          </div>
        </Link>
      </div>
      {/* Режим разработки */}
      {!supabaseInitialized && (
        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md mb-4 text-xs flex items-center z-10">
          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>Режим разработки</span>
        </div>
      )}
      {/* Навигация */}
      <nav className="flex-1 z-10">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm hover:scale-105 hover:bg-white/60 dark:hover:bg-fuchsia-900/30 ${
                isActive('/') 
                  ? 'bg-white/90 text-purple-900 shadow-lg dark:bg-fuchsia-900/40 dark:text-fuchsia-100' 
                  : 'text-purple-700/90 dark:text-fuchsia-200'
              }`}
            >
              <Home size={24} />
              <span>Главная</span>
            </Link>
          </li>
          <li>
            <Link
              to="/lessons"
              className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm hover:scale-105 hover:bg-white/60 dark:hover:bg-fuchsia-900/30 ${
                isActive('/lessons') 
                  ? 'bg-white/90 text-pink-900 shadow-lg dark:bg-fuchsia-900/40 dark:text-fuchsia-100' 
                  : 'text-pink-700/90 dark:text-fuchsia-200'
              }`}
            >
              <BookOpen size={24} />
              <span>Уроки</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dictionary"
              className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm hover:scale-105 hover:bg-white/60 dark:hover:bg-fuchsia-900/30 ${
                isActive('/dictionary') 
                  ? 'bg-white/90 text-fuchsia-900 shadow-lg dark:bg-fuchsia-900/40 dark:text-fuchsia-100' 
                  : 'text-fuchsia-700/90 dark:text-fuchsia-200'
              }`}
            >
              <Book size={24} />
              <span>Словарь</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tests"
              className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm hover:scale-105 hover:bg-white/60 dark:hover:bg-fuchsia-900/30 ${
                isActive('/tests') 
                  ? 'bg-white/90 text-indigo-900 shadow-lg dark:bg-fuchsia-900/40 dark:text-fuchsia-100' 
                  : 'text-indigo-700/90 dark:text-fuchsia-200'
              }`}
            >
              <Brain size={24} />
              <span>Тесты</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Нижний блок */}
      <div className="mt-auto pt-8 border-t border-white/30 z-10 dark:border-fuchsia-900/40">
        <ul className="space-y-2">
          <li>
            <Link
              to="/settings"
              className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm hover:scale-105 hover:bg-white/60 dark:hover:bg-fuchsia-900/30 ${
                isActive('/settings') 
                  ? 'bg-white/90 text-purple-900 shadow-lg dark:bg-fuchsia-900/40 dark:text-fuchsia-100' 
                  : 'text-purple-700/90 dark:text-fuchsia-200'
              }`}
            >
              <Settings size={22} />
              <span>Настройки</span>
            </Link>
          </li>
          <li>
            <button
              className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm hover:scale-105 hover:bg-white/60 dark:hover:bg-fuchsia-900/30 text-purple-700/90 dark:text-fuchsia-200"
              onClick={user ? handleLogout : handleLogin}
            >
              {user ? (
                <>
                  <LogOut size={22} />
                  <span>Выйти</span>
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  <span>Войти</span>
                </>
              )}
            </button>
          </li>
        </ul>
      </div>
      {/* Анимации для названия */}
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 12px #f0abfc, 0 0 24px #a78bfa; }
          50% { text-shadow: 0 0 24px #f0abfc, 0 0 48px #a78bfa; }
        }
        .animate-glow { animation: glow 2.5s infinite alternate; }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-twinkle { animation: twinkle 2.2s infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3.5s infinite; }
      `}</style>
    </div>
  );
};

export default Sidebar;
