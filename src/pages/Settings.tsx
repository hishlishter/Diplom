import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, Profile } from '@/lib/supabase';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeContext } from '@/context/ThemeContext';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Pencil } from 'lucide-react';

const privacyOptions = [
  'Доступ для всех',
  'Только для меня',
  'Только для друзей',
];

const Settings = () => {
  const { user, ensureUserProfile } = useAuth();
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [privacy, setPrivacy] = useState({
    username: 'Доступ для всех',
    job: 'Доступ для всех',
    city: 'Доступ для всех',
    country: 'Доступ для всех',
    status: 'Доступ для всех',
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeCourse, setActiveCourse] = useState('Английский');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const queryClient = useQueryClient();

  // Получаем профиль пользователя из Supabase
  const { data: profileData, isLoading } = useQuery({
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

  // Заполняем поля формы при загрузке профиля
  React.useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  // Функция для сохранения изменений профиля
  const handleSave = async () => {
    if (!user?.id || !profile) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        job: profile.job,
        city: profile.city,
        country: profile.country,
        status: profile.status,
        avatar_url: profile.avatar_url,
        privacy_username: privacy.username,
        privacy_job: privacy.job,
        privacy_city: privacy.city,
        privacy_country: privacy.country,
        privacy_status: privacy.status,
      })
      .eq('id', user.id);
    if (error) {
      toast.error('Ошибка при сохранении профиля');
    } else {
      toast.success('Профиль успешно обновлён!');
      // Обновляем кэш профиля во всех компонентах
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      queryClient.setQueryData(['profile', user.id], { ...profile });
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.email || !oldPassword || !newPassword || !repeatNewPassword) return;
    if (newPassword !== repeatNewPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    setPasswordLoading(true);
    // Сначала пробуем войти со старым паролем
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword });
    if (signInError) {
      setPasswordLoading(false);
      toast.error('Старый пароль неверный');
      return;
    }
    // Меняем пароль
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      toast.error('Ошибка при смене пароля');
    } else {
      toast.success('Пароль успешно изменён!');
      setPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
      setRepeatNewPassword('');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    // Загрузка в Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast.error('Ошибка загрузки аватарки');
      return;
    }
    // Получение публичного URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      toast.error('Ошибка получения ссылки на аватарку');
      return;
    }
    // Обновление профиля
    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
    if (updateError) {
      toast.error('Ошибка обновления профиля');
      return;
    }
    setProfile((p) => p ? { ...p, avatar_url: publicUrl } : p);
    toast.success('Аватарка обновлена!');
    // Обновляем кэш профиля во всех компонентах
    queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    queryClient.setQueryData(['profile', user.id], (old) => ({ ...old, avatar_url: publicUrl }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5f6fa] via-purple-50 to-pink-50 dark:from-[#181825] dark:via-[#232136] dark:to-[#2a273f] transition-colors duration-500">
      <div className="sticky top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 bg-white/90 dark:bg-[#232136] shadow rounded-2xl px-2 transition-all duration-300">
                <TabsTrigger value="profile">Личные данные</TabsTrigger>
                <TabsTrigger value="security">Безопасность и вход</TabsTrigger>
                <TabsTrigger value="learning">Обучение</TabsTrigger>
              </TabsList>
              {/* Личные данные */}
              <TabsContent value="profile">
                <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-[#232136] transition-all duration-300 hover:shadow-purple-200/40">
                  <div className="mb-6 text-2xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight flex items-center gap-2">
                    <span>Личные данные</span>
                  </div>
                  <div className="mb-6 flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden group avatar-glow ring-2 ring-fuchsia-400 dark:ring-fuchsia-600">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 object-cover rounded-full" />
                      ) : (
                        <UserCircle className="w-16 h-16 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <label htmlFor="avatar-upload" className="flex flex-col items-center gap-1 text-white text-xs font-semibold p-2 rounded-full bg-fuchsia-700/80 hover:bg-fuchsia-600/90 shadow-lg transition-colors cursor-pointer">
                          <Pencil size={20} color="#fff" />
                          <span>Сменить</span>
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Имя пользователя</label>
                        <Input value={profile?.username || ''} onChange={e => setProfile(p => p ? { ...p, username: e.target.value } : p)} placeholder="Имя пользователя" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Настройки приватности</label>
                        <Select value={privacy.username} onValueChange={v => setPrivacy(p => ({ ...p, username: v }))}>
                          <SelectTrigger className="ml-2 border rounded px-2 py-1 text-xs w-40">
                            <SelectValue placeholder="Приватность" />
                          </SelectTrigger>
                          <SelectContent>
                            {privacyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Должность</label>
                        <Select value={profile?.job || 'Студент'} onValueChange={v => setProfile(p => p ? { ...p, job: v } : p)}>
                          <SelectTrigger className="w-full border rounded px-3 py-2">
                            <SelectValue placeholder="Должность" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Студент">Студент</SelectItem>
                            <SelectItem value="Преподаватель">Преподаватель</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Настройки приватности</label>
                        <Select value={privacy.job} onValueChange={v => setPrivacy(p => ({ ...p, job: v }))}>
                          <SelectTrigger className="ml-2 border rounded px-2 py-1 text-xs w-40">
                            <SelectValue placeholder="Приватность" />
                          </SelectTrigger>
                          <SelectContent>
                            {privacyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Город</label>
                        <Input value={profile?.city || ''} onChange={e => setProfile(p => p ? { ...p, city: e.target.value } : p)} placeholder="Город" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Настройки приватности</label>
                        <Select value={privacy.city} onValueChange={v => setPrivacy(p => ({ ...p, city: v }))}>
                          <SelectTrigger className="ml-2 border rounded px-2 py-1 text-xs w-40">
                            <SelectValue placeholder="Приватность" />
                          </SelectTrigger>
                          <SelectContent>
                            {privacyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Страна</label>
                        <Input value={profile?.country || 'Russia'} onChange={e => setProfile(p => p ? { ...p, country: e.target.value } : p)} placeholder="Страна" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Настройки приватности</label>
                        <Select value={privacy.country} onValueChange={v => setPrivacy(p => ({ ...p, country: v }))}>
                          <SelectTrigger className="ml-2 border rounded px-2 py-1 text-xs w-40">
                            <SelectValue placeholder="Приватность" />
                          </SelectTrigger>
                          <SelectContent>
                            {privacyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Статус</label>
                        <Input value={profile?.status || 'Учу программирование'} onChange={e => setProfile(p => p ? { ...p, status: e.target.value } : p)} placeholder="Статус" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Настройки приватности</label>
                        <Select value={privacy.status} onValueChange={v => setPrivacy(p => ({ ...p, status: v }))}>
                          <SelectTrigger className="ml-2 border rounded px-2 py-1 text-xs w-40">
                            <SelectValue placeholder="Приватность" />
                          </SelectTrigger>
                          <SelectContent>
                            {privacyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSave} className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300">Сохранить изменения</Button>
                  </div>
                </Card>
              </TabsContent>
              {/* Безопасность и вход */}
              <TabsContent value="security">
                <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-[#232136] transition-all duration-300 hover:shadow-purple-200/40">
                  <div className="mb-6 text-2xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight flex items-center gap-2">
                    <span>Данные для входа</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Электронная почта</label>
                      <Input value={profile?.email || ''} readOnly placeholder="Электронная почта" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Текущий пароль</label>
                      <div className="flex items-center">
                        <Input type="password" placeholder="Пароль" readOnly value={"********"} />
                        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="ml-2">Изменить</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Смена пароля</DialogTitle>
                            </DialogHeader>
                            <Input type="password" placeholder="Старый пароль" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="mb-2" />
                            <Input type="password" placeholder="Новый пароль" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mb-2" />
                            <Input type="password" placeholder="Повторите новый пароль" value={repeatNewPassword} onChange={e => setRepeatNewPassword(e.target.value)} className="mb-4" />
                            <Button onClick={handlePasswordChange} disabled={passwordLoading || !oldPassword || !newPassword || !repeatNewPassword} className="mt-2 w-full">
                              {passwordLoading ? 'Сохраняем...' : 'Сменить пароль'}
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              {/* Обучение */}
              <TabsContent value="learning">
                <Card className="p-8 rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-[#232136] transition-all duration-300 hover:shadow-purple-200/40">
                  <div className="mb-6 text-2xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight flex items-center gap-2">
                    <span>Формат обучения</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Активный курс</label>
                      <Select value={activeCourse} onValueChange={setActiveCourse}>
                        <SelectTrigger className="w-full border rounded px-3 py-2 dark:bg-[#232136] dark:text-purple-100 dark:border-[#393552]">
                          <SelectValue placeholder="Курс" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Английский">Английский</SelectItem>
                          <SelectItem value="Арабский">Арабский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Цветовая тема</label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-full border rounded px-3 py-2 dark:bg-[#232136] dark:text-purple-100 dark:border-[#393552]">
                          <SelectValue placeholder="Тема" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Светлая">Светлая</SelectItem>
                          <SelectItem value="Тёмная">Тёмная</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300">Сохранить изменения</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
