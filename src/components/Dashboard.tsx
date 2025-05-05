import React, { useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import AchievementsDashboard from '@/components/AchievementsDashboard';
import { Profile } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { fetchTestResults } from '@/lib/supabase';
import { fetchUserLessonProgress } from '@/lib/supabase-lessons';

interface DashboardProps {
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  // Получаем данные о пройденных тестах
  const { data: testResults } = useQuery({
    queryKey: ['testResultsAll', profile.id],
    queryFn: async () => {
      if (!profile.id) return [];
      
      return fetchTestResults(profile.id);
    },
    enabled: !!profile.id,
    staleTime: 300000,
  });

  // Получаем данные о прогрессе по урокам
  const { data: lessonProgress } = useQuery({
    queryKey: ['lessonProgressAll', profile.id],
    queryFn: async () => {
      if (!profile.id) return [];
      
      return fetchUserLessonProgress(profile.id);
    },
    enabled: !!profile.id,
    staleTime: 300000,
  });
  
  // Подсчитываем общее количество пройденных уроков
  const totalCompletedLessons = React.useMemo(() => {
    if (!lessonProgress || lessonProgress.length === 0) {
      return profile.lessons_completed || 0;
    }
    
    const completedLessons = lessonProgress.filter(progress => progress.is_completed === true);
    return completedLessons.length || profile.lessons_completed || 0;
  }, [lessonProgress, profile.lessons_completed]);
  
  // Подсчитываем общее количество пройденных тестов (где is_perfect_score === true)
  const totalCompletedTests = React.useMemo(() => {
    if (!testResults || testResults.length === 0) {
      return 0;
    }
    
    const perfectScoreTests = testResults.filter(result => {
      return result.is_perfect_score === true || 
             (result.score && result.total_questions && result.score === result.total_questions);
    });
    
    return perfectScoreTests.length;
  }, [testResults]);

  // Вычисляем streak (дней подряд)
  const { data: testResultsRaw = [] } = useQuery({
    queryKey: ['all-test-results', profile.id],
    queryFn: async () => {
      if (!profile.id) return [];
      return fetchTestResults(profile.id);
    },
    enabled: !!profile.id,
    staleTime: 300000,
  });
  const { data: lessonProgressRaw = [] } = useQuery({
    queryKey: ['lessonProgressAll', profile.id],
    queryFn: async () => {
      if (!profile.id) return [];
      return fetchUserLessonProgress(profile.id);
    },
    enabled: !!profile.id,
    staleTime: 300000,
  });
  const allDates = React.useMemo(() => {
    const dates = [
      ...testResultsRaw.map(r => r.completed_at),
      ...lessonProgressRaw.map(r => r.created_at)
    ].filter(Boolean).map(d => new Date(d).toDateString());
    return Array.from(new Set(dates));
  }, [testResultsRaw, lessonProgressRaw]);
  const streak = React.useMemo(() => {
    if (!allDates.length) return 0;
    const sorted = allDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    let count = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) count++;
      else if (diff > 1) break;
    }
    const today = new Date().toDateString();
    if (!allDates.includes(today)) return 0;
    return count;
  }, [allDates]);
  // Проверка на идеальный тест
  const hasPerfectTest = React.useMemo(() => {
    if (!testResultsRaw || testResultsRaw.length === 0) return false;
    return testResultsRaw.some(r => r.is_perfect_score === true || (r.score && r.total_questions && r.score === r.total_questions));
  }, [testResultsRaw]);

  // Логирование для отладки
  useEffect(() => {
    console.log('Dashboard: Profile data:', profile);
    console.log('Dashboard: Test results:', testResults);
    console.log('Dashboard: Lesson progress:', lessonProgress);
    console.log('Dashboard: Total completed lessons:', totalCompletedLessons);
    console.log('Dashboard: Total completed tests:', totalCompletedTests);
  }, [profile, testResults, lessonProgress, totalCompletedLessons, totalCompletedTests]);
  
  return (
    <>
      <UserProfile 
        totalCompletedLessons={totalCompletedLessons} 
        totalCompletedTests={totalCompletedTests}
      />
      
      <div className="w-full">
        <AchievementsDashboard 
          totalCompletedTests={totalCompletedTests}
          totalCompletedLessons={totalCompletedLessons}
          streak={streak}
          hasPerfectTest={hasPerfectTest}
        />
      </div>
    </>
  );
};

export default Dashboard;
