import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Clock, FileText, Loader2 } from 'lucide-react';
import RightDrawer from '@/components/panels/RightDrawer';
import { AILoadingSpinner } from '@/components/loading/LoadingStates';
import { motion, AnimatePresence } from 'framer-motion';

const JobDetail = () => {
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerateLetter = async () => {
    setDrawerOpen(true);
    setIsGenerating(true);
    setLetterContent(null);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLetterContent(`親愛的招聘經理：

我對貴公司的軟體工程師職位深感興趣。透過深入了解貴公司的企業文化與發展願景，我相信我的技術背景與專業經驗能為團隊帶來價值。

在過去的工作經歷中，我曾：
• 開發並維護多個大型 React 應用程式
• 優化系統效能，提升 40% 的載入速度
• 帶領小型團隊完成關鍵專案

我期待有機會與您進一步討論，展示我如何能為貴公司做出貢獻。

此致
敬禮

[您的姓名]`);
    
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate download
    const blob = new Blob([letterContent || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `推薦信_職缺${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsDownloading(false);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">前端工程師 #{id}</CardTitle>
                <CardDescription className="text-lg">科技創新有限公司</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleGenerateLetter}>
                  <FileText className="mr-2 h-4 w-4" />
                  生成推薦信
                </Button>
                <Button className="gradient-primary">立即應徵</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                台北市
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                60K - 80K
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                全職
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">職缺描述</h3>
              <p className="text-muted-foreground">
                我們正在尋找一位熱愛前端開發的工程師，加入我們的產品團隊。您將負責開發高品質的使用者介面，
                與後端工程師及設計師密切合作，打造優秀的使用者體驗。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">所需技能</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Git</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">工作要求</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>3 年以上前端開發經驗</li>
                <li>熟悉 React 生態系統</li>
                <li>良好的溝通能力與團隊合作精神</li>
                <li>持續學習新技術的熱情</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="AI 推薦信生成"
        subtitle="根據職缺內容與您的履歷生成"
        showDownload={!!letterContent}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <AILoadingSpinner message="AI 正在生成推薦信..." />
          ) : letterContent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg"
            >
              {letterContent}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </RightDrawer>
    </div>
  );
};

export default JobDetail;
