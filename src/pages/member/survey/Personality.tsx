import { Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAppState } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Personality = () => {
  const { setIsPersonalityQuizDone } = useAppState();
  const navigate = useNavigate();

  const handleComplete = () => {
    setIsPersonalityQuizDone(true);
    navigate('/member/center');
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

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>問題 1 / 5</CardTitle>
            <CardDescription>在工作中，您傾向於...</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="a">
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <RadioGroupItem value="a" id="q1-a" />
                <Label htmlFor="q1-a" className="flex-1 cursor-pointer">
                  獨立完成任務，專注於深度思考
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <RadioGroupItem value="b" id="q1-b" />
                <Label htmlFor="q1-b" className="flex-1 cursor-pointer">
                  與團隊合作，分享想法與討論
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <RadioGroupItem value="c" id="q1-c" />
                <Label htmlFor="q1-c" className="flex-1 cursor-pointer">
                  視情況靈活調整工作方式
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" disabled>上一題</Button>
          <Button onClick={handleComplete} className="gradient-primary">完成測驗</Button>
        </div>
      </div>
    </div>
  );
};

export default Personality;
