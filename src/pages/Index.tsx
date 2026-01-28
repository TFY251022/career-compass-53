import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Briefcase,
      title: '技能搜尋',
      description: '根據您的技能快速匹配最適合的職缺',
      to: '/jobs/skill-search',
    },
    {
      icon: FileText,
      title: '履歷優化',
      description: 'AI 智能分析，打造專業履歷',
      to: '/resume/optimize',
    },
    {
      icon: BarChart3,
      title: '技能分析',
      description: '深度分析您的技能優勢與發展方向',
      to: '/analysis/skills',
    },
    {
      icon: MessageSquare,
      title: '面試準備',
      description: '模擬面試練習，提升面試表現',
      to: '/interview/prep',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI 驅動的職涯發展平台</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              打造您的
              <span className="text-gradient"> 智慧職涯 </span>
              之路
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              運用人工智慧分析技能、優化履歷、推薦職缺，讓您的求職之路更加順遂高效
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/jobs/skill-search">
                <Button size="lg" className="gap-2 gradient-primary shadow-medium">
                  開始探索
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth/register-form">
                <Button size="lg" variant="outline" className="gap-2">
                  免費註冊
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">核心功能</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              四大核心功能，全方位提升您的職涯競爭力
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.to} to={feature.to}>
                <Card className="h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl gradient-primary p-8 md:p-12 text-center text-primary-foreground shadow-large">
            <Target className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              準備好開始您的職涯旅程了嗎？
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              立即註冊，獲得個人化的職涯發展建議與最佳職缺推薦
            </p>
            <Link to="/auth/register-form">
              <Button size="lg" variant="secondary" className="gap-2">
                立即開始
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
