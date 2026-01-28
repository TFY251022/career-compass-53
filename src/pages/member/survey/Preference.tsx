import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppState } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { AILoadingSpinner, ContentTransition } from '@/components/loading/LoadingStates';
import AlertModal from '@/components/modals/AlertModal';
import { motion } from 'framer-motion';

const Preference = () => {
  const { setIsJobPreferenceQuizDone } = useAppState();
  const navigate = useNavigate();
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [selectedSalary, setSelectedSalary] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [result, setResult] = useState<any>(null);

  const preferences = [
    { id: 'remote', label: '遠端工作' },
    { id: 'startup', label: '新創公司' },
    { id: 'corporate', label: '大型企業' },
    { id: 'flexible', label: '彈性工時' },
    { id: 'overseas', label: '海外工作機會' },
    { id: 'management', label: '管理職' },
  ];

  const salaryRanges = [
    '40,000 - 60,000', 
    '60,000 - 80,000', 
    '80,000 - 100,000', 
    '100,000 以上'
  ];

  const togglePref = (id: string) => {
    setSelectedPrefs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (selectedPrefs.length === 0 || !selectedSalary) {
      setShowIncompleteAlert(true);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      matchedJobs: 42,
      topMatch: '資深前端工程師 - 科技新創',
      preferences: selectedPrefs.map(id => preferences.find(p => p.id === id)?.label),
      salary: selectedSalary,
    });
    
    setIsAnalyzing(false);
    setIsJobPreferenceQuizDone(true);
  };

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

      <div className="max-w-2xl mx-auto">
        <ContentTransition
          isLoading={isAnalyzing}
          skeleton={<AILoadingSpinner message="AI 正在分析您的偏好..." />}
        >
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{result.matchedJobs}</div>
                  <p className="text-muted-foreground">個符合條件的職缺</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>偏好摘要</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">工作環境偏好</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.preferences.map((pref: string) => (
                        <span key={pref} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">期望薪資</h4>
                    <p className="text-primary font-semibold">NT$ {result.salary}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">最佳匹配</h4>
                    <p className="text-muted-foreground">{result.topMatch}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/jobs/recommendations')}>
                  查看推薦職缺
                </Button>
                <Button onClick={() => navigate('/member/center')} className="flex-1 gradient-primary">
                  返回會員中心
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>您偏好的工作環境</CardTitle>
                  <CardDescription>請選擇所有適用的選項 (至少選擇一項)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.map((pref) => (
                    <div 
                      key={pref.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        selectedPrefs.includes(pref.id) ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                      onClick={() => togglePref(pref.id)}
                    >
                      <Checkbox 
                        id={pref.id} 
                        checked={selectedPrefs.includes(pref.id)}
                        onCheckedChange={() => togglePref(pref.id)}
                      />
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
                  {salaryRanges.map((range) => (
                    <div 
                      key={range} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        selectedSalary === range ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedSalary(range)}
                    >
                      <Checkbox 
                        id={range} 
                        checked={selectedSalary === range}
                        onCheckedChange={() => setSelectedSalary(range)}
                      />
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
          )}
        </ContentTransition>
      </div>

      <AlertModal
        open={showIncompleteAlert}
        onClose={() => setShowIncompleteAlert(false)}
        type="warning"
        title="請完成所有必填項目"
        message="請至少選擇一項工作偏好，並選擇期望薪資範圍"
        confirmLabel="了解"
      />
    </div>
  );
};

export default Preference;
