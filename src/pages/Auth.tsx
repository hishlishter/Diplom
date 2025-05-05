import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/gradients.css';

const Auth = () => {
  const { signIn, signUp, supabaseInitialized, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Show visual feedback when Supabase isn't initialized
  useEffect(() => {
    if (!supabaseInitialized) {
      toast.warning('Supabase не настроен', {
        description: 'Необходимо настроить переменные окружения для Supabase',
        duration: 8000,
      });
    }
  }, [supabaseInitialized]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    
    setIsLoading(true);
    try {
      const displayName = username || email.split('@')[0];
      await signUp(email, password, displayName);
    } catch (error) {
      toast.error('Ошибка регистрации. Попробуйте другой email.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-100 dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] relative overflow-hidden transition-colors duration-300">
      {/* Декоративные градиентные круги */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 rounded-full opacity-30 blur-3xl animate-blob z-0 dark:from-purple-900 dark:via-fuchsia-900 dark:to-indigo-900" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 rounded-full opacity-20 blur-2xl animate-blob animation-delay-2000 z-0 dark:from-fuchsia-900 dark:via-purple-900 dark:to-indigo-900" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-indigo-200 via-pink-200 to-purple-200 rounded-full opacity-20 blur-2xl animate-blob animation-delay-4000 z-0 dark:from-indigo-900 dark:via-fuchsia-900 dark:to-purple-900" />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-300 rounded-full p-4 shadow-lg mb-4 animate-float dark:from-purple-700 dark:via-fuchsia-700 dark:to-indigo-700">
            <BookOpen className="h-16 w-16 text-purple-600 dark:text-fuchsia-300" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 mb-2 tracking-tight text-center drop-shadow-lg dark:from-fuchsia-400 dark:via-purple-400 dark:to-indigo-400">MarGO</h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-2 dark:from-fuchsia-400 dark:to-purple-400" />
          <p className="text-lg text-muted-foreground text-center max-w-md mb-2 dark:text-purple-200">Открой новые горизонты английского языка вместе с MarGO!</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-fade-in dark:bg-[#232136] dark:text-purple-100 dark:border-[#393552]">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 rounded-xl p-1 shadow-sm dark:bg-[#232136] dark:border-[#393552]">
              <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-pink-100 rounded-lg text-lg font-semibold transition-all dark:data-[state=active]:from-fuchsia-900 dark:data-[state=active]:to-purple-900 dark:text-purple-100">Вход</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-pink-100 rounded-lg text-lg font-semibold transition-all dark:data-[state=active]:from-fuchsia-900 dark:data-[state=active]:to-purple-900 dark:text-purple-100">Регистрация</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="signin-email" className="text-gray-700 font-medium dark:text-purple-200">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="mt-2 bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-purple-300 text-base py-3 px-4 rounded-xl shadow-sm dark:bg-[#2a273f] dark:text-purple-100 dark:border-[#393552] dark:placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="text-gray-700 font-medium dark:text-purple-200">Пароль</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="mt-2 bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-purple-300 text-base py-3 px-4 rounded-xl shadow-sm dark:bg-[#2a273f] dark:text-purple-100 dark:border-[#393552] dark:placeholder:text-purple-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 text-lg dark:from-fuchsia-700 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-fuchsia-700"
                  disabled={isLoading || !supabaseInitialized}
                >
                  {isLoading ? 'Загрузка...' : 'Войти'}
                </Button>
                {!supabaseInitialized && (
                  <div className="flex items-center mt-4 p-3 bg-blue-50 rounded-lg text-blue-600 text-sm dark:bg-[#232136] dark:text-purple-200">
                    <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p>
                      Для настройки Supabase, создайте файл .env с переменными VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
                    </p>
                  </div>
                )}
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label htmlFor="signup-username" className="text-gray-700 font-medium dark:text-purple-200">Имя пользователя</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Ваше имя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading || !supabaseInitialized}
                    className="mt-2 bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-purple-300 text-base py-3 px-4 rounded-xl shadow-sm dark:bg-[#2a273f] dark:text-purple-100 dark:border-[#393552] dark:placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-gray-700 font-medium dark:text-purple-200">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="mt-2 bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-purple-300 text-base py-3 px-4 rounded-xl shadow-sm dark:bg-[#2a273f] dark:text-purple-100 dark:border-[#393552] dark:placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-gray-700 font-medium dark:text-purple-200">Пароль</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="mt-2 bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-purple-300 text-base py-3 px-4 rounded-xl shadow-sm dark:bg-[#2a273f] dark:text-purple-100 dark:border-[#393552] dark:placeholder:text-purple-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 text-lg dark:from-fuchsia-700 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-fuchsia-700"
                  disabled={isLoading || !supabaseInitialized}
                >
                  {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
