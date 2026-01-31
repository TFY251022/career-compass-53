import { useState } from 'react';
import { User, FileText, Map, Settings, Edit, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAppState } from '@/contexts/AppContext';
import EditProfileModal from '@/components/member/EditProfileModal';

const MemberCenter = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { isResumeUploaded, isPersonalityQuizDone, isJobPreferenceQuizDone } = useAppState();

  const quickLinks = [
    { to: '/member/my-resumes', icon: FileText, label: '我的履歷' },
    { to: '/member/career-path', icon: Map, label: '職涯地圖' },
    { to: '/member/password', icon: Settings, label: '密碼設定' },
  ];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">會員中心</h1>
          <p className="text-muted-foreground">管理您的帳戶與職涯資訊</p>
        </div>

        {/* Premium Tech Profile Card */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          {/* Radial gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 30%, hsl(152 50% 85% / 0.9) 0%, hsl(165 40% 92% / 0.6) 50%, transparent 80%),
                linear-gradient(135deg, hsl(165 35% 94%) 0%, hsl(152 30% 90%) 100%)
              `
            }}
          />
          
          {/* Glassmorphism decorative shape */}
          <div 
            className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl rotate-12"
            style={{
              background: 'hsl(152 45% 35% / 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid hsl(152 45% 35% / 0.2)'
            }}
          />
          <div 
            className="absolute -bottom-3 -right-3 w-20 h-20 rounded-xl rotate-6"
            style={{
              background: 'hsl(152 50% 40% / 0.2)',
              backdropFilter: 'blur(4px)',
            }}
          />
          
          {/* Left accent bar */}
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-primary" />
          
          {/* Card content */}
          <Card className="relative bg-transparent border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">個人資料</CardTitle>
                  <CardDescription>您的基本資訊</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)} className="bg-background/60 backdrop-blur-sm">
                <Edit className="h-4 w-4 mr-2" />
                修改資料
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">姓名</p>
                <p className="font-semibold text-foreground">會員姓名</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">電子郵件</p>
                <p className="font-semibold text-foreground">member@example.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">電話</p>
                <p className="font-semibold text-foreground">0912-345-678</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">職稱</p>
                <p className="font-semibold text-foreground">軟體工程師</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">履歷上傳</span>
                <Badge variant={isResumeUploaded ? 'default' : 'secondary'}>
                  {isResumeUploaded ? '已完成' : '未完成'}
                </Badge>
              </div>
              {!isResumeUploaded && (
                <Link to="/member/upload-resume">
                  <Button variant="link" className="px-0 mt-2">立即上傳</Button>
                </Link>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">職涯問卷</span>
                <Badge variant={isPersonalityQuizDone ? 'default' : 'secondary'}>
                  {isPersonalityQuizDone ? '已完成' : '未完成'}
                </Badge>
              </div>
              {!isPersonalityQuizDone && (
                <Link to="/member/survey/personality">
                  <Button variant="link" className="px-0 mt-2">開始測驗</Button>
                </Link>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">工作偏好</span>
                <Badge variant={isJobPreferenceQuizDone ? 'default' : 'secondary'}>
                  {isJobPreferenceQuizDone ? '已完成' : '未完成'}
                </Badge>
              </div>
              {!isJobPreferenceQuizDone && (
                <Link to="/member/survey/preference">
                  <Button variant="link" className="px-0 mt-2">開始填寫</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card className="hover:shadow-medium transition-all hover:-translate-y-1">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
};

export default MemberCenter;
