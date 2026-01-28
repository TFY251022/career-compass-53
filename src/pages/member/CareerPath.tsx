import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CareerPath = () => {
  const milestones = [
    { year: '現在', title: '軟體工程師', status: 'current' },
    { year: '2年後', title: '資深工程師', status: 'future' },
    { year: '5年後', title: '技術主管', status: 'future' },
    { year: '10年後', title: '技術總監', status: 'future' },
  ];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">職涯路徑</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          規劃您的職涯發展藍圖
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>職涯發展時程</CardTitle>
            <CardDescription>根據您的技能與目標規劃的發展路徑</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start gap-6 pl-10">
                    <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                      milestone.status === 'current' 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-muted-foreground'
                    }`} />
                    <div>
                      <p className="text-sm text-muted-foreground">{milestone.year}</p>
                      <p className="font-semibold text-lg">{milestone.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerPath;
