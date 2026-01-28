import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Password = () => {
  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">密碼設定</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          更新您的帳戶密碼
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>變更密碼</CardTitle>
            <CardDescription>請輸入您的新密碼</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">目前密碼</Label>
              <Input id="currentPassword" type="password" placeholder="請輸入目前密碼" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密碼</Label>
              <Input id="newPassword" type="password" placeholder="請輸入新密碼" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input id="confirmPassword" type="password" placeholder="請再次輸入新密碼" />
            </div>
            <Button className="w-full gradient-primary">更新密碼</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Password;
