import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SkillSearch = () => {
  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">技能搜尋職缺</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          輸入您的技能，找到最匹配的職缺
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <Input placeholder="輸入技能關鍵字，例如：React, Python, 專案管理..." className="flex-1" />
          <Button className="gradient-primary">搜尋</Button>
        </div>
      </div>

      <div className="grid gap-4 max-w-3xl mx-auto">
        <Card className="hover:shadow-medium transition-shadow">
          <CardHeader>
            <CardTitle>職缺搜尋結果</CardTitle>
            <CardDescription>請輸入技能關鍵字開始搜尋</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">搜尋結果將顯示在此處</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillSearch;
