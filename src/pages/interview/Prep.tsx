import { useState } from 'react';
import { MessageSquare, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RightDrawer from '@/components/panels/RightDrawer';
import { AILoadingSpinner } from '@/components/loading/LoadingStates';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTopics, mockThankYouLetter } from '@/mocks/interview';

const Prep = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerateThankYou = async () => {
    setDrawerOpen(true);
    setIsGenerating(true);
    setLetterContent(null);
    
    // TODO: Replace with API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setLetterContent(mockThankYouLetter);
    
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const blob = new Blob([letterContent || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '面試感謝函.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    setIsDownloading(false);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">面試準備</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          模擬面試練習，提升您的面試表現
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">面試後感謝函</h3>
                <p className="text-sm text-muted-foreground">AI 自動生成專業感謝函</p>
              </div>
            </div>
            <Button onClick={handleGenerateThankYou} className="gradient-primary">
              生成感謝函
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* TODO: Replace with API call */}
        {mockTopics.map((topic, index) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-medium transition-shadow h-full">
              <CardHeader>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">開始練習</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="AI 感謝函生成"
        subtitle="根據面試情況自動生成"
        showDownload={!!letterContent}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <AILoadingSpinner message="AI 正在生成感謝函..." />
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

export default Prep;
