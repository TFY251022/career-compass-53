import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MyResumes = () => {
  const resumes = [
    { id: 1, name: '軟體工程師履歷_v2.pdf', updatedAt: '2024-01-15' },
    { id: 2, name: '前端工程師履歷.docx', updatedAt: '2024-01-10' },
  ];

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
          {resumes.map((resume) => (
            <Card key={resume.id}>
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
                  <Button variant="ghost" size="icon">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyResumes;
