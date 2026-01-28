import { Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppState } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Preference = () => {
  const { setIsJobPreferenceQuizDone } = useAppState();
  const navigate = useNavigate();

  const handleComplete = () => {
    setIsJobPreferenceQuizDone(true);
    navigate('/member/center');
  };

  const preferences = [
    { id: 'remote', label: '遠端工作' },
    { id: 'startup', label: '新創公司' },
    { id: 'corporate', label: '大型企業' },
    { id: 'flexible', label: '彈性工時' },
    { id: 'overseas', label: '海外工作機會' },
    { id: 'management', label: '管理職' },
  ];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">工作偏好問卷</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          告訴我們您的工作偏好，獲得更符合期望的職缺推薦
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>您偏好的工作環境</CardTitle>
            <CardDescription>請選擇所有適用的選項</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preferences.map((pref) => (
              <div key={pref.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted">
                <Checkbox id={pref.id} />
                <Label htmlFor={pref.id} className="flex-1 cursor-pointer">
                  {pref.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>期望薪資範圍</CardTitle>
            <CardDescription>請選擇您的期望月薪</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['40,000 - 60,000', '60,000 - 80,000', '80,000 - 100,000', '100,000 以上'].map((range) => (
              <div key={range} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted">
                <Checkbox id={range} />
                <Label htmlFor={range} className="flex-1 cursor-pointer">
                  NT$ {range}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} className="gradient-primary">完成問卷</Button>
        </div>
      </div>
    </div>
  );
};

export default Preference;
