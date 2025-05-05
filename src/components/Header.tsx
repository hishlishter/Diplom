import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase, Profile } from '@/lib/supabase';
import { ThemeContext } from '@/context/ThemeContext';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  // Получаем профиль пользователя
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 300000,
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white shadow-sm dark:bg-[#181825] dark:shadow-none transition-colors duration-300">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xl font-semibold ml-2 dark:text-purple-100 transition-colors duration-300">{title}</h1>}
      </div>
      <div className="flex items-center gap-4">
        {/* Переключатель темы */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-[#232136] transition focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Сменить тему"
        >
          {theme === 'Тёмная' ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-purple-700 dark:text-purple-200" />}
        </button>
        {/* Аватарка пользователя с меню */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400">
              <Avatar className="avatar-glow ring-2 ring-fuchsia-400 dark:ring-fuchsia-600">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile?.username || user?.email} />
                ) : null}
                <AvatarFallback>{profile?.username?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-[#232136] dark:text-purple-100 dark:border-[#232136]">
            <DropdownMenuLabel className="dark:text-purple-200">{profile?.username || user?.email || 'Пользователь'}</DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-[#232136]" />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="dark:text-purple-300">Настройки</DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-[#232136]" />
            <DropdownMenuItem onClick={handleLogout} className="dark:text-red-400">Выйти</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
