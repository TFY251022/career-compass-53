import { useState } from 'react';
import { FileText, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AILoadingSpinner, ContentTransition, AnalysisSkeleton } from '@/components/loading/LoadingStates';
import { motion } from 'framer-motion';

const Optimize = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setResult({
      originalScore: 72,
      optimizedScore: 89,
      suggestions: [
        { section: '工作經歷', original: '負責前端開發', optimized: '主導 5+ 個前端專案開發，提升使用者體驗滿意度 40%' },
        { section: '技能描述', original: '熟悉 React', optimized: '精通 React 生態系統 (Redux, React Query, Next.js)，具備 3 年實戰經驗' },
        { section: '自我介紹', original: '我是一名前端工程師', optimized: '具備 5 年經驗的前端工程師，專注於打造高效能、可維護的使用者介面' },
      ],
    });
    
    setIsAnalyzing(false);
  };

  const handleDownload = () => {
    // Simulate download
    const content = result.suggestions.map((s: any) => `${s.section}:\n原始：${s.original}\n優化：${s.optimized}\n`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '履歷優化建議.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">履歷優化</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          運用 AI 分析您的履歷，提供專業優化建議
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <ContentTransition
          isLoading={isAnalyzing}
          skeleton={
            <div className="space-y-6">
              <AILoadingSpinner message="AI 正在深度分析您的履歷..." />
              <AnalysisSkeleton />
            </div>
          }
        >
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Comparison */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">優化前</p>
                      <div className="text-4xl font-bold text-muted-foreground">{result.originalScore}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">優化後</p>
                      <div className="text-4xl font-bold text-primary">{result.optimizedScore}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full" style={{ width: `${result.optimizedScore}%` }} />
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>優化建議</CardTitle>
                  <CardDescription>AI 為您生成的優化內容</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.suggestions.map((s: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-2"
                    >
                      <h4 className="font-medium text-primary">{s.section}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">原始</p>
                          <p className="text-sm">{s.original}</p>
                        </div>
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-xs text-primary mb-1">優化後</p>
                          <p className="text-sm">{s.optimized}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
                  重新分析
                </Button>
                <Button className="flex-1 gradient-primary gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  下載優化建議
                </Button>
              </div>
            </motion.div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>上傳履歷進行分析</CardTitle>
                <CardDescription>支援 PDF、DOC、DOCX 格式</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={handleAnalyze}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">拖曳檔案至此處或點擊上傳</p>
                  <Button className="gradient-primary pointer-events-none">選擇檔案</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </ContentTransition>
      </div>
    </div>
  );
};

export default Optimize;
