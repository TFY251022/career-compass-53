import { useState } from 'react';
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
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">性格測驗</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          了解您的職場性格特質，獲得更精準的職涯建議
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContentTransition
          isLoading={isAnalyzing}
          skeleton={<AILoadingSpinner message="AI 正在分析您的性格特質..." />}
        >
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{result.type}</div>
                  <p className="text-lg font-medium">{result.title}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>性格分析</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{result.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">核心特質</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.traits.map((trait: string) => (
                        <span key={trait} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => navigate('/member/center')} className="w-full gradient-primary">
                返回會員中心
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>問題 {currentQuestion + 1} / {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-8 rounded-full ${i <= currentQuestion ? 'bg-primary' : 'bg-muted'}`} 
                    />
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardDescription>{questions[currentQuestion].question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={answers[currentQuestion] || ''} 
                    onValueChange={handleAnswer}
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div 
                        key={option.value} 
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <RadioGroupItem value={option.value} id={`q${currentQuestion}-${option.value}`} />
                        <Label htmlFor={`q${currentQuestion}-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0}>
                  上一題
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleComplete} className="gradient-primary">
                    完成測驗
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gradient-primary">
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
  );
};

export default Personality;
