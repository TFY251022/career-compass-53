import { useState } from 'react';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RightDrawer from '@/components/panels/RightDrawer';
import { motion } from 'framer-motion';

interface Resume {
  id: number;
  name: string;
  updatedAt: string;
  content: string;
}

const MyResumes = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const resumes: Resume[] = [
    { 
      id: 1, 
      name: '軟體工程師履歷_v2.pdf', 
      updatedAt: '2024-01-15',
      content: `王小明
前端工程師

聯絡方式
Email: xiaoming@example.com
電話: 0912-345-678

工作經歷

科技公司 A | 前端工程師 | 2022 - 現在
• 開發維護公司核心產品前端
• 使用 React + TypeScript 建構現代化 UI
• 優化效能，提升載入速度 40%

新創公司 B | 初階工程師 | 2020 - 2022
• 參與多個客戶專案開發
• 學習並應用前端最佳實踐

技能
React, TypeScript, JavaScript, CSS, Git, Node.js`
    },
    { 
      id: 2, 
      name: '前端工程師履歷.docx', 
      updatedAt: '2024-01-10',
      content: `王小明 - 前端工程師履歷

專精於 React 生態系統的前端開發者，
具備 3 年以上實戰經驗。

核心技能：
- React / Next.js
- TypeScript
- Tailwind CSS
- REST API 整合

期望職位：資深前端工程師
期望薪資：NT$ 70,000 - 90,000`
    },
  ];

  const handlePreview = (resume: Resume) => {
    setSelectedResume(resume);
    setDrawerOpen(true);
  };

  const handleDownload = async () => {
    if (!selectedResume) return;
    
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const blob = new Blob([selectedResume.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedResume.name;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsDownloading(false);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">我的履歷</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          管理您已上傳的履歷檔案
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-6">
          <Link to="/member/upload-resume">
            <Button className="gradient-primary">上傳新履歷</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-medium transition-shadow">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{resume.name}</p>
                      <p className="text-sm text-muted-foreground">更新於 {resume.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handlePreview(resume)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="履歷預覽"
        subtitle={selectedResume?.name}
        showDownload
        onDownload={handleDownload}
        isDownloading={isDownloading}
      >
        {selectedResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg font-mono"
          >
            {selectedResume.content}
          </motion.div>
        )}
      </RightDrawer>
    </div>
  );
};

export default MyResumes;
