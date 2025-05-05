import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchLessonWithTest } from '@/lib/supabase-lessons';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LessonTestModalProps {
  lessonId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleteLesson: (score: number, totalQuestions: number) => void;
}

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    is_correct: boolean;
  }[];
}

const LessonTestModal: React.FC<LessonTestModalProps> = ({
  lessonId,
  open,
  onOpenChange,
  onCompleteLesson,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['lesson-test', lessonId],
    queryFn: () => fetchLessonWithTest(lessonId),
    enabled: open,
  });

  const questions = data?.questions || [];

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      const selectedOptionIndex = selectedAnswers[question.id];
      if (selectedOptionIndex !== undefined && question.options[selectedOptionIndex].is_correct) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    onCompleteLesson(finalScore, questions.length);
  };

  const handleClose = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Загрузка теста...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data?.test || questions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Тест недоступен</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                К сожалению, тест для этого урока недоступен. Пожалуйста, попробуйте позже.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data.test.title || 'Тест по уроку'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {isSubmitted ? (
            <div className="space-y-4">
              <div className={`flex items-center justify-center p-4 rounded-lg ${
                score === questions.length ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {score === questions.length ? (
                  <CheckCircle className="h-6 w-6 mr-2" />
                ) : (
                  <AlertCircle className="h-6 w-6 mr-2" />
                )}
                <span className="font-medium">
                  Ваш результат: {score} из {questions.length} правильных ответов
                </span>
              </div>
              {questions.map((question, index) => {
                const selectedOption = selectedAnswers[question.id];
                return (
                  <div key={question.id} className="space-y-2">
                    <p className="font-medium">Вопрос {index + 1}: {question.text}</p>
                    <div className="ml-2 space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isSelected = selectedOption === optIndex;
                        const isCorrect = option.is_correct;
                        let style = '';
                        if (isSelected && isCorrect) {
                          style = 'bg-green-100 text-green-700 border-green-400';
                        } else if (isSelected && !isCorrect) {
                          style = 'bg-red-100 text-red-700 border-red-400';
                        }
                        return (
                          <div
                            key={optIndex}
                            className={`p-2 rounded border ${style}`}
                          >
                            {option.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {score === questions.length ? (
                <Button onClick={handleClose} className="w-full mt-4">
                  Закрыть
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center text-yellow-700 dark:text-yellow-400 font-semibold">
                    Не все ответы верны. Рекомендуем ещё раз прочитать теоретическую часть урока и попробовать снова!
                  </div>
                  <Button onClick={handleClose} className="w-full mt-2" variant="outline">
                    Вернуться к теоретической части
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <p className="font-medium">Вопрос {index + 1}: {question.text}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <Button
                        key={optIndex}
                        variant={selectedAnswers[question.id] === optIndex ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => handleAnswerSelect(question.id, optIndex)}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                onClick={handleSubmit}
                className="w-full mt-4"
                disabled={Object.keys(selectedAnswers).length !== questions.length}
              >
                Завершить тест
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonTestModal; 