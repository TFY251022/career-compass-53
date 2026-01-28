import { Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Recommendations = () => {
  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">職缺推薦</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          根據您的技能與偏好，為您推薦最適合的職缺
        </p>
      </div>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>推薦職缺 {i}</CardTitle>
                  <CardDescription>公司名稱 · 台北市</CardDescription>
                </div>
                <Badge className="gradient-primary text-primary-foreground">
                  匹配度 {90 - i * 5}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">職缺簡述內容待補充</p>
              <Link to={`/jobs/${i}`}>
                <Button variant="outline" size="sm">查看詳情</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
