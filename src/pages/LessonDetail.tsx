import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { fetchLessonWithTest, saveLessonTestResult } from '@/lib/supabase-lessons';
import { saveLessonProgress } from '@/lib/lesson-helpers';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import LessonTestModal from '@/components/LessonTestModal';

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('theory');
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [pendingTestScore, setPendingTestScore] = useState<number | null>(null);
  const [pendingTotalQuestions, setPendingTotalQuestions] = useState<number | null>(null);
  
  // Получаем урок из базы данных
  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fetchLessonWithTest(Number(id)),
    staleTime: 600000, // 10 минут кэширования
    enabled: !!id
  });
  
  const lesson = data?.lesson;
  
  // Мутация для сохранения прогресса урока
  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id || pendingTestScore === null || pendingTotalQuestions === null) return false;
      const success = await saveLessonTestResult(
        user.id,
        Number(id),
        pendingTestScore,
        pendingTotalQuestions
      );
      if (!success) {
        throw new Error('Не удалось сохранить прогресс');
      }
      return success;
    },
    onSuccess: () => {
      // Инвалидируем кэши запросов для обновления данных
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['lesson-progress', user.id] });
        queryClient.invalidateQueries({ queryKey: ['lessonProgressAll', user.id] });
      }
      setIsLessonCompleted(true);
      toast.success('Урок успешно завершен!', {
        description: 'Вы можете продолжить обучение.'
      });
      // Обновляем кэш профиля (UserProfile) вручную
      if (user?.id) {
        const oldProfile = queryClient.getQueryData(['profile', user.id]);
        if (oldProfile && typeof oldProfile === 'object' && 'lessons_completed' in oldProfile) {
          const profileWithLessons = oldProfile as { lessons_completed: number };
          queryClient.setQueryData(['profile', user.id], {
            ...oldProfile,
            lessons_completed: (profileWithLessons.lessons_completed || 0) + 1
          });
        }
      }
    },
    onError: (error) => {
      console.error('Ошибка сохранения прогресса:', error);
      toast.error('Не удалось завершить урок');
    }
  });
  
  // Сохраняем прогресс в localStorage для неавторизованных пользователей
  const saveLocalProgress = (lessonId: number) => {
    try {
      const storedCompletedLessons = localStorage.getItem('completedLessons');
      let completedLessons: number[] = [];
      
      if (storedCompletedLessons) {
        completedLessons = JSON.parse(storedCompletedLessons);
      }
      
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
      }
      
      setIsLessonCompleted(true);
    } catch (error) {
      console.error('Ошибка при сохранении прогресса урока:', error);
    }
  };
  
  // Обработчик завершения урока
  const handleCompleteLesson = (testScore: number, totalQuestions: number) => {
    setPendingTestScore(testScore);
    setPendingTotalQuestions(totalQuestions);
    if (user && id) {
      completeLessonMutation.mutate();
    } else {
      // Для неавторизованных пользователей сохраняем в localStorage
      if (id) {
        saveLocalProgress(Number(id));
        toast.success("Урок успешно завершен!", {
          description: "Вы можете продолжить обучение."
        });
      }
    }
  };
  
  // Проверяем, завершен ли уже урок при загрузке
  useEffect(() => {
    if (id) {
      // Для неавторизованных пользователей проверяем localStorage
      if (!user) {
        try {
          const storedCompletedLessons = localStorage.getItem('completedLessons');
          if (storedCompletedLessons) {
            const completedLessons = JSON.parse(storedCompletedLessons);
            setIsLessonCompleted(completedLessons.includes(Number(id)));
          }
        } catch (error) {
          console.error('Ошибка при проверке завершенных уроков:', error);
        }
      }
    }
  }, [id, user]);
  
  // Если урок не найден или загружается
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="sticky top-0 h-screen z-20">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header title="Загрузка урока..." />
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto flex justify-center items-center h-full">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Загрузка данных урока...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !lesson) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="sticky top-0 h-screen z-20">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header title="Урок не найден" />
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <Card className="rounded-2xl shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Урок не найден</h2>
                    <p className="text-muted-foreground mb-6">
                      Запрашиваемый урок не существует или был удален
                    </p>
                    <Button onClick={() => navigate('/lessons')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к списку уроков
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header title={lesson.title} />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => navigate(`/lessons?category=${lesson.category}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к урокам
              </Button>
            </div>
            
            <Card className="mb-6 rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                
                <div className="mt-8 border-t pt-6">
                  <Button 
                    onClick={() => setIsTestModalOpen(true)}
                    className={`w-full ${isLessonCompleted ? "bg-green-600 hover:bg-green-700" : ""}`}
                    disabled={isLessonCompleted || completeLessonMutation.isPending}
                  >
                    {completeLessonMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : isLessonCompleted ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Урок завершен
                      </>
                    ) : (
                      "Пройти тест"
                    )}
                  </Button>
                  <LessonTestModal lessonId={Number(id)} open={isTestModalOpen} onOpenChange={setIsTestModalOpen} onCompleteLesson={handleCompleteLesson} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonDetail;
