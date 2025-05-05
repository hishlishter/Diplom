import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTests, fetchTestResults, Test } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, Clock, FileText, RefreshCw, AlertTriangle, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Tests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedTestIds, setCompletedTestIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Добавляем параметр refetch для обновления данных
  const { 
    data: tests, 
    isLoading, 
    error, 
    refetch: refetchTests 
  } = useQuery({
    queryKey: ['tests'],
    queryFn: fetchTests,
    staleTime: 300000, // 5 минут кэширования
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  // Fetch test results if user is logged in
  const { data: testResults, refetch: refetchResults } = useQuery({
    queryKey: ['testResults', user?.id],
    queryFn: () => fetchTestResults(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 300000,
    retry: 2
  });

  // Принудительно обновляем прогресс по тестам при возврате на страницу
  useEffect(() => {
    if (user?.id) {
      refetchResults();
    }
  }, [user?.id, refetchResults]);

  // Функция для обновления данных
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchTests(), refetchResults()]);
      toast.success('Данные обновлены');
    } catch (err) {
      console.error('Ошибка при обновлении данных:', err);
      toast.error('Ошибка при обновлении данных');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Process test results to identify completed tests (with perfect score)
  useEffect(() => {
    if (testResults && Array.isArray(testResults) && testResults.length > 0 && tests) {
      // Определяем ID тестов, которые пройдены успешно
      const completedIds = testResults
        .filter(result => {
          if (result.is_perfect_score === true) {
            return true;
          }
          return result.score === result.total_questions;
        })
        .map(result => result.test_id);
      setCompletedTestIds(completedIds);
      console.log('Пройденные тесты:', completedIds);
    }
  }, [testResults, tests]);
  
  // Показываем ошибку если есть
  useEffect(() => {
    if (error) {
      console.error('Ошибка загрузки тестов:', error);
      toast.error('Не удалось загрузить тесты', {
        description: 'Пожалуйста, проверьте подключение к интернету и попробуйте снова'
      });
    }
  }, [error]);
  
  // Функция для проверки типа ошибки
  const isNetworkError = (error: any) => {
    return error?.message?.includes('Failed to fetch') || 
           error?.details?.includes('Failed to fetch');
  };

  // Компонент для отображения сетевой ошибки
  const NetworkErrorMessage = () => (
    <div className="text-center py-12 space-y-6">
      <div className="flex justify-center">
        <AlertTriangle size={64} className="text-amber-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">Проблема с подключением</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Не удается соединиться с сервером. Проверьте ваше подключение к интернету и попробуйте снова.
      </p>
      <Button 
        onClick={handleRefresh} 
        disabled={isRefreshing}
        className="mt-4"
      >
        {isRefreshing ? (
          <>
            <RefreshCw size={16} className="mr-2 animate-spin" />
            Обновление...
          </>
        ) : (
          <>
            <RefreshCw size={16} className="mr-2" />
            Попробовать снова
          </>
        )}
      </Button>
    </div>
  );
  
  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl shadow-2xl p-8 dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] dark:shadow-purple-900/40 dark:border dark:border-[#393552]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 rounded-full p-2 shadow-lg dark:from-purple-900 dark:via-fuchsia-900 dark:to-indigo-900">
                  <Brain className="h-10 w-10 text-purple-500 dark:text-fuchsia-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight dark:text-purple-100">Тесты</h1>
                  <p className="text-muted-foreground dark:text-purple-300">Проверьте свой уровень знаний английского языка с помощью наших тестов</p>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Каждый тест содержит вопросы разной сложности и помогает определить области, которые требуют дополнительного изучения.
                </p>
              </div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin text-primary mb-4">
                    <RefreshCw size={40} />
                  </div>
                  <p>Загрузка тестов...</p>
                </div>
              ) : error ? (
                isNetworkError(error) ? (
                  <NetworkErrorMessage />
                ) : (
                  <div className="text-center py-12 text-red-500">
                    <AlertTriangle size={40} className="mx-auto mb-4" />
                    <p>Ошибка загрузки тестов. Пожалуйста, попробуйте позже.</p>
                    <Button 
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      variant="outline"
                      className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
                    >
                      {isRefreshing ? 'Обновление...' : 'Обновить'}
                    </Button>
                  </div>
                )
              ) : tests && tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((test) => {
                    const isCompleted = completedTestIds.includes(test.id);
                    return (
                      <Card 
                        key={test.id} 
                        className={`relative flex flex-col h-full rounded-2xl shadow-xl transition-all duration-300 pt-8 ${isCompleted ? 'border-green-200 bg-green-50/30 dark:bg-green-900/30' : 'bg-white/90 dark:bg-[#232136] dark:border-[#393552]'} hover:shadow-2xl hover:shadow-fuchsia-500/30`}
                        onClick={() => navigate(`/tests/${test.id}`)}
                      >
                        {/* Бейдж "Пройден" */}
                        {isCompleted && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Пройден
                          </span>
                        )}
                        <CardContent className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center dark:bg-fuchsia-900/30">
                              <FileText size={24} className="text-primary dark:text-fuchsia-300" />
                            </div>
                          </div>
                          <CardTitle className="mb-2 dark:text-purple-100">{test.title}</CardTitle>
                          <CardDescription className="mb-4 dark:text-purple-300">{test.description}</CardDescription>
                          <div className="flex items-center text-sm text-muted-foreground mb-4 dark:text-purple-400">
                            <Clock size={16} className="mr-1" />
                            <span>{test.time_limit} минут</span>
                            <span className="mx-2">•</span>
                            <Award size={16} className="mr-1" />
                            <span>{test.difficulty}</span>
                          </div>
                          <div className="flex-1" />
                          <Button className={`w-full mt-2 font-semibold transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:from-pink-500 hover:to-purple-500 dark:from-fuchsia-700 dark:to-indigo-700 dark:hover:from-indigo-700 dark:hover:to-fuchsia-700 ${isCompleted ? 'opacity-80' : ''}`}
                            onClick={e => { e.stopPropagation(); navigate(`/tests/${test.id}`); }}>
                            {isCompleted ? 'Пройти снова' : 'Начать тест'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="mb-4">Пока нет доступных тестов. Пожалуйста, зайдите позже.</p>
                  <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:from-pink-500 hover:to-purple-500 transition-all duration-200">
                    {isRefreshing ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Обновление...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        Обновить
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
