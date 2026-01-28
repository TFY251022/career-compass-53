import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Prep = () => {
  const topics = [
    { title: '自我介紹', description: '如何有效地展現自己' },
    { title: '技術面試', description: '常見技術問題與解答技巧' },
    { title: '行為面試', description: 'STAR 法則與實例演練' },
    { title: '薪資談判', description: '如何談出理想薪資' },
  ];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">面試準備</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          模擬面試練習，提升您的面試表現
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {topics.map((topic) => (
          <Card key={topic.title} className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">開始練習</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Prep;
