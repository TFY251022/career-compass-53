import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  BarChart3, 
  Target,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const coreFeatures = [
    {
      icon: Search,
      title: '職缺核心查詢',
      description: '透過AI進行職缺JD分析，快速抓取職缺核心能力，讓求職者更容易了解市場對該職位的期待。',
      to: '/jobs/skill-search',
    },
    {
      icon: FileText,
      title: '履歷優化工具',
      description: '運用AI深度分析履歷內容，針對用戶履歷進行專業優化建議，協助突顯個人優勢。',
      to: '/resume/optimize',
    },
    {
      icon: BarChart3,
      title: '職能圖譜分析',
      description: '基於大數據進行職涯路徑匹配，提供客觀市場分析與預測建議，探索更多可能性。',
      to: '/analysis/skills',
    },
  ];

  const additionalFeatures = [
    {
      icon: Target,
      title: '職缺匹配',
      description: '智慧比對您的技能與職位需求，為您精準推薦最適合的工作機會。',
      to: '/jobs/recommendations',
    },
    {
      icon: MessageSquare,
      title: '面試輔助',
      description: '集結過往面試技巧及面試紀錄，提供即時職缺求職語氣調整，助您自信應對。',
      to: '/interview/prep',
    },
    {
      icon: Mail,
      title: '感謝信生成',
      description: 'AI將根據您的面試內容自動生成感謝信，有溫度的面試感謝信，為您增添好印象。',
      to: '/interview/prep',
    },
    {
      icon: Award,
      title: '成就記錄',
      description: '轉職前不必再翻過往資歷記錄，日常動態追蹤記錄您的職涯成就與里程碑，為您打造專屬職涯擋案。',
      to: '/member/career-path',
    },
  ];

  const stats = [
    { value: '5000+', label: '服務用戶', subLabel: '累積求職者使用數' },
    { value: '98%', label: '滿意度', subLabel: '用戶好評率' },
    { value: '50+', label: '合作企業', subLabel: '企業夥伴數' },
  ];

  const news = [
    { date: '09', month: '1月25', title: '技術團隊發佈更新', description: '新功能持續優化升級中' },
    { date: '10', month: '1月25', title: '獲得創業首輪融資', description: '感謝各界合作夥伴支持' },
    { date: '11', month: '1月25', title: '積累用戶數達標', description: '突破五千名用戶註冊' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg py-16 md:py-24 lg:py-32">
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-primary-foreground"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                找到屬於你的職涯道路
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
                透過AI技術分析職缺、深入分析技能、打造匹配路線藍圖，精準匹配最適合你的職涯選擇。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs/skill-search">
                  <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                    開始
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth/register-form">
                  <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    了解更多
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div className="w-64 h-64 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-primary-foreground/30 flex items-center justify-center">
                  <Users className="w-24 h-24 text-primary-foreground/80" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary font-medium mb-2">核心</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">核心功能介紹</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              結合先進AI技術與大數據分析
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.to}>
                  <Card className="h-full feature-card group">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">數據說明一切</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-lg font-semibold mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.subLabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary font-medium mb-2">功能</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">一站式智慧職涯導航平台</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              利用AI與大數據，將複雜繁瑣的求職流程，整合為智慧化的舒適體驗。
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.to}>
                  <Card className="h-full feature-card group">
                    <CardContent className="pt-6 flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/jobs/skill-search">
              <Button className="gradient-primary gap-2">
                探索更多服務
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-primary font-medium mb-2">News</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">最新消息</h2>
            <p className="text-muted-foreground">
              了解職星領航員的最新動態與更新資訊
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {news.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 p-4 bg-card rounded-xl border border-border hover:shadow-soft transition-shadow"
              >
                <div className="flex-shrink-0 text-center border-r border-border pr-6">
                  <p className="text-2xl font-bold text-primary">{item.date}</p>
                  <p className="text-xs text-muted-foreground">{item.month}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-primary font-medium mb-2">聯絡</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">聯絡我們</h2>
            <p className="text-muted-foreground">
              如有任何問題歡迎隨時聯繫
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">電郵</h3>
                <p className="text-muted-foreground text-sm">contact@careerpilot.com</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">電話</h3>
                <p className="text-muted-foreground text-sm">+886 2 1234 5678</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">辦公室</h3>
                <p className="text-muted-foreground text-sm">台北市信義區信義路五段7號</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
