import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/contexts/AppContext';
import { AILoadingSpinner, ContentTransition, AnalysisSkeleton } from '@/components/loading/LoadingStates';
import AlertModal from '@/components/modals/AlertModal';
import { motion } from 'framer-motion';
import LoginRequired from '@/components/gatekeeper/LoginRequired';

const UploadResume = () => {
  const { setIsResumeUploaded } = useAppState();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showFormatError, setShowFormatError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file format
    if (!validFormats.includes(file.type)) {
      setShowFormatError(true);
      return;
    }

    setIsUploading(true);
    setUploadComplete(false);
    
    // Simulate upload and analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalysisResult({
      score: 85,
      strengths: ['技術技能描述完整', '經歷說明清晰', '排版美觀'],
      improvements: ['可以加入更多量化成果', '建議增加專案連結'],
      skills: ['React', 'TypeScript', 'Node.js', 'Git'],
    });
    
    setIsUploading(false);
    setUploadComplete(true);
    setIsResumeUploaded(true);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <LoginRequired>
      <div className="container py-8 md:py-12 animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 mb-4 md:mb-6">
            <Upload className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">上傳履歷</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            上傳您的履歷，開啟智慧職涯分析
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ContentTransition
            isLoading={isUploading}
            skeleton={
              <div className="space-y-6">
                <AILoadingSpinner message="正在分析您的履歷內容..." />
                <AnalysisSkeleton />
              </div>
            }
          >
            {uploadComplete && analysisResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 md:space-y-6"
              >
                {/* Score Card */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{analysisResult.score}</div>
                    <p className="text-muted-foreground text-sm md:text-base">履歷評分</p>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-base md:text-lg text-green-600">✓ 優勢項目</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card>
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-base md:text-lg text-amber-600">⚡ 改善建議</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.improvements.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Button onClick={() => { setUploadComplete(false); setAnalysisResult(null); }} variant="outline" className="w-full text-sm md:text-base">
                  重新上傳
                </Button>
              </motion.div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">選擇履歷檔案</CardTitle>
                  <CardDescription className="text-xs md:text-sm">支援 PDF、DOC、DOCX 格式，檔案大小上限 10MB</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleClick}
                  >
                    <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
                    <p className="text-base md:text-lg font-medium mb-2">拖曳檔案至此處</p>
                    <p className="text-muted-foreground text-sm mb-4 md:mb-6">或點擊選擇檔案</p>
                    <Button className="gradient-primary pointer-events-none text-sm md:text-base">
                      選擇檔案
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </ContentTransition>
        </div>

        <AlertModal
          open={showFormatError}
          onClose={() => setShowFormatError(false)}
          type="error"
          title="格式不符"
          message="請上傳 PDF、DOC 或 DOCX 格式的履歷檔案"
          confirmLabel="了解"
        />
      </div>
    </LoginRequired>
  );
};

export default UploadResume;
