import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoginRequired from '@/components/gatekeeper/LoginRequired';

const Password = () => {
  return (
    <LoginRequired>
      <div className="container py-8 md:py-12 animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 mb-4 md:mb-6">
            <Lock className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">密碼設定</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            更新您的帳戶密碼
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">變更密碼</CardTitle>
              <CardDescription className="text-xs md:text-sm">請輸入您的新密碼</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="currentPassword" className="text-sm md:text-base">目前密碼</Label>
                <Input id="currentPassword" type="password" placeholder="請輸入目前密碼" className="text-sm md:text-base" />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="newPassword" className="text-sm md:text-base">新密碼</Label>
                <Input id="newPassword" type="password" placeholder="請輸入新密碼" className="text-sm md:text-base" />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm md:text-base">確認新密碼</Label>
                <Input id="confirmPassword" type="password" placeholder="請再次輸入新密碼" className="text-sm md:text-base" />
              </div>
              <Button className="w-full gradient-primary text-sm md:text-base">更新密碼</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LoginRequired>
  );
};

export default Password;
