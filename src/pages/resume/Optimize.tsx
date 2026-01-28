import { FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Optimize = () => {
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

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>上傳履歷進行分析</CardTitle>
            <CardDescription>支援 PDF、DOC、DOCX 格式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">拖曳檔案至此處或點擊上傳</p>
              <Button className="gradient-primary">選擇檔案</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Optimize;
