import { useState } from 'react';
// 職涯問卷 (formerly 性格測驗)
import { Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAppState } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { AILoadingSpinner, ContentTransition } from '@/components/loading/LoadingStates';
import AlertModal from '@/components/modals/AlertModal';
import { motion } from 'framer-motion';
import LoginRequired from '@/components/gatekeeper/LoginRequired';

const questions = [
  {
    id: 1,
    question: '在工作中，您傾向於...',
    options: [
      { value: 'a', label: '獨立完成任務，專注於深度思考' },
      { value: 'b', label: '與團隊合作，分享想法與討論' },
      { value: 'c', label: '視情況靈活調整工作方式' },
    ],
  },
  {
    id: 2,
    question: '面對壓力時，您通常會...',
    options: [
      { value: 'a', label: '保持冷靜，有條理地解決問題' },
      { value: 'b', label: '尋求他人協助，共同應對' },
      { value: 'c', label: '先休息調整，再重新出發' },
    ],
  },
  {
    id: 3,
    question: '您更傾向於...',
    options: [
      { value: 'a', label: '在穩定的環境中精進專業' },
      { value: 'b', label: '接受新挑戰，嘗試不同領域' },
      { value: 'c', label: '平衡穩定與挑戰' },
    ],
  },
];

const Personality = () => {
  const { setIsPersonalityQuizDone } = useAppState();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      setShowIncompleteAlert(true);
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (Object.keys(answers).length < questions.length) {
      setShowIncompleteAlert(true);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setResult({
      type: 'INTJ',
      title: '策略型建築師',
      description: '您是一位獨立思考者，擅長規劃與策略制定。在工作中，您傾向於深度分析問題並提出創新解決方案。',
      traits: ['分析能力強', '獨立自主', '策略思維', '追求完美'],
    });
    
    setIsAnalyzing(false);
    setIsPersonalityQuizDone(true);
  };

  return (
    <LoginRequired>
      <div className="container py-8 md:py-12 animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 mb-4 md:mb-6">
            <Brain className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">職涯問卷</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            了解您的職場性格特質，獲得更精準的職涯建議
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ContentTransition
            isLoading={isAnalyzing}
            skeleton={<AILoadingSpinner message="正在分析您的職涯傾向..." />}
          >
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 md:space-y-6"
              >
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{result.type}</div>
                    <p className="text-base md:text-lg font-medium">{result.title}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-base md:text-lg">性格分析</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm md:text-base">{result.description}</p>
                    <div>
                      <h4 className="font-medium mb-2 text-sm md:text-base">核心特質</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.traits.map((trait: string) => (
                          <span key={trait} className="px-2.5 py-1 md:px-3 md:py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => navigate('/member/center')} className="w-full gradient-primary text-sm md:text-base">
                  返回會員中心
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {/* Progress */}
                <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-2 md:mb-4">
                  <span>問題 {currentQuestion + 1} / {questions.length}</span>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 md:h-2 w-6 md:w-8 rounded-full ${i <= currentQuestion ? 'bg-primary' : 'bg-muted'}`} 
                      />
                    ))}
                  </div>
                </div>

                <Card>
                  <CardHeader className="pb-2 md:pb-4">
                    <CardDescription className="text-sm md:text-base">{questions[currentQuestion].question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={answers[currentQuestion] || ''} 
                      onValueChange={handleAnswer}
                    >
                      {questions[currentQuestion].options.map((option) => (
                        <div 
                          key={option.value} 
                          className="flex items-center space-x-2 p-2.5 md:p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <RadioGroupItem value={option.value} id={`q${currentQuestion}-${option.value}`} />
                          <Label htmlFor={`q${currentQuestion}-${option.value}`} className="flex-1 cursor-pointer text-sm md:text-base">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <div className="flex justify-between gap-3">
                  <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0} className="flex-1 sm:flex-none text-sm md:text-base">
                    上一題
                  </Button>
                  {currentQuestion === questions.length - 1 ? (
                    <Button onClick={handleComplete} className="gradient-primary flex-1 sm:flex-none text-sm md:text-base">
                      完成測驗
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gradient-primary flex-1 sm:flex-none text-sm md:text-base">
                      下一題
                    </Button>
                  )}
                </div>
              </div>
            )}
          </ContentTransition>
        </div>

        <AlertModal
          open={showIncompleteAlert}
          onClose={() => setShowIncompleteAlert(false)}
          type="warning"
          title="請完成所有題目"
          message="請先回答當前問題後再繼續"
          confirmLabel="了解"
        />
      </div>
    </LoginRequired>
  );
};

export default Personality;
