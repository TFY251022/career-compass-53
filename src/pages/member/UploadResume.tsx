import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/contexts/AppContext';

const UploadResume = () => {
  const { setIsResumeUploaded } = useAppState();

  const handleUpload = () => {
    setIsResumeUploaded(true);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">上傳履歷</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          上傳您的履歷，開啟智慧職涯分析
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>選擇履歷檔案</CardTitle>
            <CardDescription>支援 PDF、DOC、DOCX 格式，檔案大小上限 10MB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">拖曳檔案至此處</p>
              <p className="text-muted-foreground mb-6">或點擊選擇檔案</p>
              <Button onClick={handleUpload} className="gradient-primary">
                選擇檔案
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadResume;
