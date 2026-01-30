import { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AILoadingSpinner, ContentTransition, AnalysisSkeleton } from '@/components/loading/LoadingStates';
import { motion } from 'framer-motion';

const Skills = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const skills = [
    { name: 'JavaScript', level: 85, category: '程式語言' },
    { name: 'React', level: 80, category: '前端框架' },
    { name: 'TypeScript', level: 75, category: '程式語言' },
    { name: 'Node.js', level: 70, category: '後端技術' },
    { name: 'Python', level: 60, category: '程式語言' },
  ];

  const recommendations = [
    { skill: 'Next.js', reason: '基於您的 React 經驗，學習 Next.js 可提升全端能力' },
    { skill: 'GraphQL', reason: '現代 API 技術，與您的技術棧相輔相成' },
    { skill: 'Docker', reason: '容器化技術，提升部署效率' },
  ];

  const handleRefresh = async () => {
    setShowResults(false);
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleDownload = () => {
    const content = skills.map(s => `${s.name}: ${s.level}%`).join('\n');
    const blob = new Blob([`技能分析報告\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '技能分析報告.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">職能圖譜</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          深入分析您的技能優勢與發展潛力
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <ContentTransition
          isLoading={isAnalyzing}
          skeleton={
            <div className="space-y-6">
              <AILoadingSpinner message="正在分析您的技能組合..." />
              <AnalysisSkeleton />
            </div>
          }
        >
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Skills Analysis */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>技能評估</CardTitle>
                    <CardDescription>根據您的履歷與經歷分析</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    重新分析
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Skill Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>推薦學習</CardTitle>
                  <CardDescription>根據市場趨勢與您的技能組合</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.skill}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">+</span>
                      </div>
                      <div>
                        <p className="font-medium">{rec.skill}</p>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Button className="w-full gradient-primary gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                下載分析報告
              </Button>
            </motion.div>
          )}
        </ContentTransition>
      </div>
    </div>
  );
};

export default Skills;
