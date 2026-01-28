import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Skills = () => {
  const skills = [
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'TypeScript', level: 75 },
    { name: 'Node.js', level: 70 },
    { name: 'Python', level: 60 },
  ];

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">技能分析</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          深入分析您的技能優勢與發展潛力
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>技能評估</CardTitle>
            <CardDescription>根據您的履歷與經歷分析</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Skills;
