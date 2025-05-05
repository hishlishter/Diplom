import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLessons, fetchUserLessonProgress, Lesson } from '@/lib/supabase-lessons';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Languages, GraduationCap, Play, CheckCircle, Clock, Award, BookText, MessageSquareQuote } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

const LessonSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="bg-primary/10 p-4 flex items-center">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="w-full">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-end pt-2">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const extractDescriptionFromContent = (content: string): string => {
  const match = content.match(/<p>(.*?)<\/p>/);
  if (match && match[1]) {
    const text = match[1].replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 147) + '...' : text;
  }
  
  const textOnly = content.replace(/<[^>]*>/g, '');
  return textOnly.length > 150 ? textOnly.substring(0, 147) + '...' : textOnly;
};

const CATEGORIES = {
  grammar: {
    title: 'Грамматика',
    description: 'Изучение грамматических правил и конструкций',
    icon: BookOpen
  },
  vocabulary: {
    title: 'Лексика',
    description: 'Расширение словарного запаса',
    icon: Languages
  },
  phrases: {
    title: 'Устойчивые выражения',
    description: 'Идиомы, фразовые глаголы и устойчивые выражения',
    icon: MessageSquareQuote
  }
} as const;

const getLessonIconByLevel = (level: string | undefined) => {
  if (!level) {
    return <Languages className="h-6 w-6" />;
  }
  
  switch (level.toLowerCase()) {
    case 'начальный':
    case 'beginner':
      return <Languages className="h-6 w-6" />;
    case 'средний':
    case 'intermediate':
      return <BookOpen className="h-6 w-6" />;
    case 'продвинутый':
    case 'advanced':
      return <GraduationCap className="h-6 w-6" />;
    default:
      return <Languages className="h-6 w-6" />;
  }
};

const Lessons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { resolvedTheme } = useTheme ? useTheme() : { resolvedTheme: 'light' };
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get('category') as keyof typeof CATEGORIES || 'grammar';
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>(initialCategory);
  
  const { data: lessons, isLoading: isLessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessons,
    staleTime: 300000,
  });
  
  const { data: lessonProgress, isLoading: isProgressLoading, refetch: refetchProgress } = useQuery({
    queryKey: ['lesson-progress', user?.id],
    queryFn: () => user?.id ? fetchUserLessonProgress(user.id) : Promise.resolve([]),
    staleTime: 300000,
    enabled: !!user?.id,
  });
  
  useEffect(() => {
    if (user?.id && Array.isArray(lessonProgress) && lessonProgress.length > 0) {
      const completedLessonIds = lessonProgress
        .filter(progress => progress.is_completed)
        .map(progress => progress.lesson_id);
      setCompletedLessons(completedLessonIds);
    }
  }, [user?.id, lessonProgress]);
  
  useEffect(() => {
    if (user?.id) {
      refetchProgress();
    }
  }, [user?.id, refetchProgress]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') as keyof typeof CATEGORIES;
    if (cat && cat !== activeCategory) setActiveCategory(cat);
  }, [location.search]);
  
  const handleStartLesson = (lessonId: number) => {
    navigate(`/lessons/${lessonId}`);
    toast.success("Урок открыт", {
      description: "Теперь вы можете изучать теоретический материал"
    });
  };
  
  const isLoading = isLessonsLoading || (user?.id && isProgressLoading);
  const lessonsToShow = lessons?.filter(lesson => lesson.category === activeCategory).map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: extractDescriptionFromContent(lesson.content),
    level: lesson.level,
    icon: getLessonIconByLevel(lesson.level),
  })) || [];

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header title="Уроки английского языка" />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl shadow-2xl p-8 dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] dark:shadow-purple-900/40 dark:border dark:border-[#393552]">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full p-2 shadow-lg bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 dark:from-purple-900 dark:via-fuchsia-900 dark:to-indigo-900">
                  <BookOpen className="h-10 w-10 text-purple-500 dark:text-fuchsia-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight dark:text-white">Доступные уроки</h2>
                  <p className="text-muted-foreground dark:text-purple-300">Выберите категорию и урок для изучения</p>
                </div>
              </div>

              <Tabs defaultValue="grammar" value={activeCategory} onValueChange={(value) => setActiveCategory(value as keyof typeof CATEGORIES)} className="mb-8">
                <TabsList className="grid grid-cols-3 gap-4 bg-transparent">
                  {Object.entries(CATEGORIES).map(([key, category]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <category.icon className="h-4 w-4" />
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(CATEGORIES).map(([key, category]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-white/50 dark:bg-white/5 rounded-2xl">
                      <category.icon className="h-12 w-12 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{category.title}</h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    {lessonsError ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                        Произошла ошибка при загрузке уроков. Пожалуйста, попробуйте позже.
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                          Array(3).fill(0).map((_, index) => (
                            <LessonSkeleton key={index} />
                          ))
                        ) : lessonsToShow.length > 0 ? (
                          lessonsToShow.map((lesson) => (
                            <Card
                              key={lesson.id}
                              className={`relative flex flex-col h-full rounded-2xl shadow-xl transition-all duration-300 pt-8 ${
                                completedLessons.includes(lesson.id)
                                  ? 'border-green-200 bg-green-50/30 dark:bg-green-900/30'
                                  : 'bg-gradient-to-br from-purple-100 via-pink-50 to-white dark:from-[#232136] dark:via-[#181825] dark:to-[#2a273f] dark:border-[#393552]'
                              } border-2 hover:shadow-2xl hover:shadow-fuchsia-500/30`}
                            >
                              {completedLessons.includes(lesson.id) && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Пройден
                                </span>
                              )}
                              <CardContent className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-2">
                                    {lesson.icon}
                                    <div>
                                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                                      <p className="text-sm text-muted-foreground">{lesson.level}</p>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-muted-foreground mb-4 flex-1">{lesson.description}</p>
                                <Button 
                                  className={`w-full mt-2 font-semibold transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:from-pink-500 hover:to-purple-500 dark:from-fuchsia-700 dark:to-indigo-700 dark:hover:from-indigo-700 dark:hover:to-fuchsia-700 ${
                                    completedLessons.includes(lesson.id) ? 'opacity-80' : ''
                                  }`}
                                  onClick={e => { e.stopPropagation(); handleStartLesson(lesson.id); }}
                                >
                                  {completedLessons.includes(lesson.id) ? 'Повторить урок' : 'Начать урок'}
                                </Button>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                            <p className="text-muted-foreground">В этой категории пока нет уроков</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lessons;