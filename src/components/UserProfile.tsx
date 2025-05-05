import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Sparkles, BookOpen, Flame } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Profile, createOrUpdateProfile } from '@/lib/supabase';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfileProps {
  totalCompletedLessons?: number;
  totalCompletedTests?: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  totalCompletedLessons,
  totalCompletedTests
}) => {
  const { user, ensureUserProfile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempAvatarURL, setTempAvatarURL] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const fallbackProfile: Profile = user ? {
    id: user.id,
    username: user.user_metadata?.username || user.user_metadata?.name || 'Пользователь',
    email: user.email || '',
    tests_completed: 0,
    lessons_completed: 0
  } : {
    id: 'guest',
    username: 'Гость',
    email: '',
    tests_completed: 0,
    lessons_completed: 0
  };

  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      const cachedProfile = localStorage.getItem(`profile_${user.id}`);
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile) as Profile;
          setLocalProfile(parsed);
        } catch (e) {
          console.error('Error parsing cached profile:', e);
        }
      }
    }
  }, [user?.id]);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      
      try {
        console.log('UserProfile: Fetching profile data for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('UserProfile: Error fetching profile:', error);
          
          if (error.code === 'PGRST116') {
            console.log('UserProfile: Profile not found, attempting to create');
            return ensureUserProfile(user);
          }
          
          return localProfile || fallbackProfile;
        }
        
        if (data) {
          console.log('UserProfile: Caching profile data:', data);
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
          setLocalProfile(data);
          return data;
        }
        
        return localProfile || fallbackProfile;
      } catch (e) {
        console.error('UserProfile: Unexpected error fetching profile:', e);
        return localProfile || fallbackProfile;
      }
    },
    enabled: !!user?.id,
    staleTime: 300000,
    placeholderData: localProfile || fallbackProfile,
    refetchOnWindowFocus: true, // Изменено на true для обновления данных при фокусе
    refetchInterval: 60000, // Обновление каждую минуту
    retry: 1
  });

  // Динамический подсчёт количества пройденных тестов
  const { data: completedTestsCount } = useQuery({
    queryKey: ['all-test-results', user?.id, new Date().getFullYear()],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id);
      if (error || !data) return 0;
      // Считаем только те тесты, где is_perfect_score === true или score === total_questions
      return data.filter(result => result.completed_at && (result.is_perfect_score === true || (result.score && result.total_questions && result.score === result.total_questions))).length;
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    staleTime: 300000,
    retry: 1
  });

  // Обработчик мутации для обновления аватара пользователя
  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const updatedProfile = {
        ...(profile || localProfile || fallbackProfile),
        avatar_url: avatarUrl
      };
      setLocalProfile(updatedProfile);
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
      
      return createOrUpdateProfile(updatedProfile);
    },
    onSuccess: () => {
      toast.success('Аватар успешно обновлен');
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      toast.error('Ошибка при обновлении аватара');
      console.error('Update avatar error:', error);
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setTempAvatarURL(fileURL);
      setAvatarFile(file);
    }
  };

  const saveAvatar = async () => {
    if (!avatarFile || !user) {
      toast.error('Файл не выбран');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          try {
            const base64String = event.target.result.toString();
            await updateAvatarMutation.mutateAsync(base64String);
            setDialogOpen(false);
          } catch (error) {
            console.error('Error saving avatar:', error);
            toast.error('Ошибка при сохранении аватара');
          } finally {
            setIsUploading(false);
          }
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        toast.error('Ошибка при чтении файла');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(avatarFile);
    } catch (error) {
      toast.error('Ошибка при обработке изображения');
      console.error('Avatar processing error:', error);
      setIsUploading(false);
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const profileData = profile || localProfile || fallbackProfile;

  // Важно! Используем переданные пропсы с приоритетом, но completedTestsCount — всегда актуально
  const displayTestsCompleted = typeof completedTestsCount === 'number' ? completedTestsCount : (typeof totalCompletedTests === 'number' ? totalCompletedTests : profileData.tests_completed || 0);
  const displayLessonsCompleted = typeof totalCompletedLessons === 'number' ? totalCompletedLessons : profileData.lessons_completed || 0;

  // Логирование для отладки
  useEffect(() => {
    console.log('UserProfile: Props received:', { totalCompletedTests, totalCompletedLessons });
    console.log('UserProfile: Profile data:', profileData);
    console.log('UserProfile: Display values:', { displayTestsCompleted, displayLessonsCompleted });
  }, [totalCompletedTests, totalCompletedLessons, profileData, displayTestsCompleted, displayLessonsCompleted]);

  // --- Новый блок: вычисление streak (дней подряд) ---
  const { data: testResults = [] } = useQuery({
    queryKey: ['all-test-results', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('test_results')
        .select('completed_at')
        .eq('user_id', user.id);
      if (error || !data) return [];
      return data;
    },
    enabled: !!user?.id,
    staleTime: 300000,
  });
  const { data: lessonProgress = [] } = useQuery({
    queryKey: ['lesson-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('created_at')
        .eq('user_id', user.id);
      if (error || !data) return [];
      return data;
    },
    enabled: !!user?.id,
    staleTime: 300000,
  });
  // Собираем все даты активности (уроки и тесты)
  const allDates = React.useMemo(() => {
    const dates = [
      ...testResults.map(r => r.completed_at),
      ...lessonProgress.map(r => r.created_at)
    ].filter(Boolean).map(d => new Date(d).toDateString());
    return Array.from(new Set(dates));
  }, [testResults, lessonProgress]);
  // Вычисляем streak (дней подряд)
  const streak = React.useMemo(() => {
    if (!allDates.length) return 0;
    const sorted = allDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    let count = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) count++;
      else if (diff > 1) break;
    }
    // Проверяем, был ли сегодня вход
    const today = new Date().toDateString();
    if (!allDates.includes(today)) return 0;
    return count;
  }, [allDates]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-32 mt-4" />
        <Skeleton className="h-4 w-48 mt-2" />
        <div className="w-full mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <div>Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-white rounded-2xl p-8 shadow-xl flex flex-col items-center relative overflow-hidden dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] dark:shadow-purple-900/40 dark:border dark:border-[#393552]">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-pink-200/10 rounded-full blur-2xl z-0" />
      <div className="flex flex-row items-center gap-4 justify-center mt-2">
        <div className="relative">
          <Avatar className="w-28 h-28 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-purple-300/60 avatar-glow ring-2 ring-fuchsia-400 dark:ring-fuchsia-600">
            <AvatarImage src={profileData.avatar_url || '/placeholder.svg'} />
            <AvatarFallback>{getInitials(profileData.username)}</AvatarFallback>
          </Avatar>
        </div>
        {profileData.status && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-white dark:from-[#232136] dark:via-[#181825] dark:to-[#232136] border border-purple-200 dark:border-purple-700 shadow-xl rounded-2xl px-6 py-2 text-purple-700 dark:text-purple-200 font-semibold text-base flex items-center min-w-[90px] justify-center">
              {profileData.status}
            </div>
          </div>
        )}
      </div>
      <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm z-10 flex items-center gap-3 dark:text-purple-100">
        {/* Огонёк с количеством дней streak + tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="relative flex items-center group">
                {/* Кастомный SVG огонька с анимацией */}
                <span className="block w-10 h-10 relative">
                  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                    <g>
                      <path className="flame-main" d="M20 36c7-4 10-10 10-15 0-6-4-10-10-18-6 8-10 12-10 18 0 5 3 11 10 15z" fill="#FDBA74"/>
                      <path className="flame-inner animate-flame" d="M20 32c4-3 6-6 6-9 0-3-2-5-6-10-4 5-6 7-6 10 0 3 2 6 6 9z" fill="#F59E42"/>
                      <path className="flame-tip animate-flame" d="M20 26c2-2 3-4 3-6 0-2-1-3-3-6-2 3-3 4-3 6 0 2 1 4 3 6z" fill="#FDE68A"/>
                    </g>
                  </svg>
                  {streak > 0 && (
                    <span className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 font-extrabold text-orange-700 text-base pointer-events-none select-none" style={{textShadow:'0 2px 8px #fff, 0 1px 0 #fbbf24'}}>{streak}</span>
                  )}
                </span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-sm font-semibold text-orange-700 bg-white/90 shadow-lg border border-orange-200">
              Серия дней подряд: {streak}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {profileData.username}
      </h3>
      <p className="text-muted-foreground text-sm font-medium z-10 dark:text-purple-200">
        {profileData.email}
      </p>
      <div className="w-full mt-8 grid grid-cols-2 gap-6 text-center z-10">
        <div className="py-5 px-2 rounded-xl bg-white border border-[#ece6f5] shadow flex flex-col items-center transition-transform duration-300 hover:scale-105 dark:bg-[#232136] dark:border-[#393552]">
          <Sparkles className="mb-2 text-purple-500 dark:text-fuchsia-300" size={28} />
          <p className="text-muted-foreground text-xs dark:text-purple-300">Пройдено тестов</p>
          <p className="text-4xl font-extrabold text-purple-700 drop-shadow dark:text-purple-100">
            {displayTestsCompleted}
          </p>
        </div>
        <div className="py-5 px-2 rounded-xl bg-white border border-[#ece6f5] shadow flex flex-col items-center transition-transform duration-300 hover:scale-105 dark:bg-[#232136] dark:border-[#393552]">
          <BookOpen className="mb-2 text-pink-500 dark:text-fuchsia-300" size={28} />
          <p className="text-muted-foreground text-xs dark:text-purple-300">Пройдено уроков</p>
          <p className="text-4xl font-extrabold text-pink-700 drop-shadow dark:text-purple-100">
            {displayLessonsCompleted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
