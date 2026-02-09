import { useState } from 'react';
import { User, FileText, Map, Edit, Star, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAppState } from '@/contexts/AppContext';
import EditProfileModal from '@/components/member/EditProfileModal';
import PasswordModal from '@/components/member/PasswordModal';
import LoginRequired from '@/components/gatekeeper/LoginRequired';

const MemberCenter = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const { isResumeUploaded, isPersonalityQuizDone } = useAppState();

  return (
    <LoginRequired>
      <div className="container py-8 md:py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/10 mb-4 md:mb-6">
              <User className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">會員中心</h1>
            <p className="text-muted-foreground text-sm md:text-base">管理您的帳戶與職涯資訊</p>
          </div>

          {/* Profile Info Card */}
          <Card className="mb-6 md:mb-8">
            <CardContent className="pt-5 md:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[4rem]">姓名</span>
                  <span className="font-medium">王小明</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[4rem]">電子郵件</span>
                  <span className="font-medium">user@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[4rem]">電話</span>
                  <span className="font-medium">0912-345-678</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[4rem]">職稱</span>
                  <span className="font-medium">前端工程師</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <div className="flex justify-center gap-3 mb-6 md:mb-8">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              修改資料
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordModalOpen(true)}
              className="border-primary/40 text-primary hover:bg-primary/5 hover:shadow-[0_0_8px_hsl(var(--primary)/0.15)] hover:-translate-y-0.5 transition-all"
            >
              <Lock className="h-4 w-4 mr-2" />
              變更密碼
            </Button>
          </div>

          {/* Status Cards - kept as-is */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium">履歷上傳</span>
                  <Badge variant={isResumeUploaded ? 'default' : 'secondary'} className="text-xs">
                    {isResumeUploaded ? '已完成' : '未完成'}
                  </Badge>
                </div>
                {!isResumeUploaded && (
                  <Link to="/member/upload-resume">
                    <Button variant="link" className="px-0 mt-1 md:mt-2 text-xs md:text-sm h-auto">立即上傳</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium">職涯問卷</span>
                  <Badge variant={isPersonalityQuizDone ? 'default' : 'secondary'} className="text-xs">
                    {isPersonalityQuizDone ? '已完成' : '未完成'}
                  </Badge>
                </div>
                {!isPersonalityQuizDone && (
                  <Link to="/member/survey/personality">
                    <Button variant="link" className="px-0 mt-1 md:mt-2 text-xs md:text-sm h-auto">開始測驗</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hero Portal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* 我的履歷 Card */}
            <Link to="/member/my-resumes" className="group block">
              <div
                className="relative rounded-2xl border bg-card p-6 md:p-8 flex flex-col items-center text-center h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] hover:border-primary/30"
              >
                {/* Subtle tech grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                      linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold mb-1.5">我的履歷</h2>
                    <p className="text-sm text-muted-foreground">查看並編輯您優化後的專業履歷</p>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    進入查看
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Link>

            {/* 職涯地圖 Card */}
            <Link to="/member/career-path" className="group block">
              <div
                className="relative rounded-2xl p-6 md:p-8 flex flex-col items-center text-center h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                style={{
                  background: 'linear-gradient(135deg, hsl(152 50% 38%), hsl(165 45% 30%))',
                }}
              >
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Map className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold mb-1.5 text-white">職涯地圖</h2>
                    <p className="text-sm text-white/75">掌握您的職能發展路徑與階梯圖</p>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 border-white/40 text-white hover:bg-white/20 hover:text-white bg-transparent">
                    進入地圖
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
        <PasswordModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
      </div>
    </LoginRequired>
  );
};

export default MemberCenter;
