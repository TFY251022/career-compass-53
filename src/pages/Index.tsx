import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, BarChart3, Target, ArrowRight, Mail, Phone, MapPin, Star, Upload, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Diamond Star Icon Component
const DiamondStar = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
  </svg>
);

const Index = () => {
  const coreFeatures = [
    {
      icon: FileText,
      title: '履歷優化',
      description: '深度分析您的履歷內容，提供專業優化建議，協助突顯個人優勢與競爭力。',
      to: '/resume/optimize'
    },
    {
      icon: Target,
      title: '推薦職缺',
      description: '基於您的技能與偏好，智能匹配最適合的職位機會，提升求職效率與成功率。',
      to: '/jobs/recommendations'
    },
    {
      icon: BarChart3,
      title: '職能圖譜',
      description: '基於大數據進行職涯路徑匹配，提供客觀市場分析與預測建議，探索更多可能性。',
      to: '/analysis/skills'
    }
  ];

  const news = [
    {
      date: '09',
      month: '1月25',
      title: '技術團隊發佈更新',
      description: '新功能持續優化升級中'
    },
    {
      date: '10',
      month: '1月25',
      title: '獲得創業首輪融資',
      description: '感謝各界合作夥伴支持'
    },
    {
      date: '11',
      month: '1月25',
      title: '積累用戶數達標',
      description: '突破五千名用戶註冊'
    }
  ];

  const heroStats = [
    { value: '50K+', label: '活躍用戶' },
    { value: '90%', label: '匹配準確率' },
    { value: '300+', label: '合作企業' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg">
        <div className="container relative z-10 py-20 md:py-28 lg:py-36">
          {/* Top tagline with Diamond Star */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center gap-2 text-primary">
              <DiamondStar className="h-4 w-4" />
              <span className="text-sm font-medium">數據驅動的AI職涯助手</span>
            </div>
          </motion.div>

          {/* Floating Card - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block absolute left-8 xl:left-20 top-1/2 -translate-y-1/2 animate-float"
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 min-w-[180px]">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">履歷已優化</p>
                <p className="text-xs text-muted-foreground">關鍵字 +12</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Card - Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block absolute right-8 xl:right-20 top-1/3 -translate-y-1/2 animate-float-delayed"
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 min-w-[180px]">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DiamondStar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">職缺分析完成</p>
                <p className="text-xs text-muted-foreground">匹配度達 90%+</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Centered */}
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-foreground leading-tight"
            >
              讓你的才華
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-primary"
            >
              被世界精準對焦
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              職海無涯，讓我們一起優雅上岸。<br />
              打造專屬職涯藍圖，精準匹配理想職缺，提升面試成功率。
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Link to="/jobs/skill-search">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold px-8 py-6 text-base rounded-xl shadow-lg"
                >
                  立即開始
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth/register-form">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold px-8 py-6 text-base rounded-xl"
                >
                  快速體驗
                </Button>
              </Link>
            </motion.div>

            {/* Bottom Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-12 md:gap-20"
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold mb-1 text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wave SVG at bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 120L48 110C96 100 192 80 288 75C384 70 480 80 576 85C672 90 768 90 864 85C960 80 1056 70 1152 70C1248 70 1344 80 1392 85L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
              fill="hsl(28 70% 95%)"
            />
          </svg>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <DiamondStar className="h-3 w-3 text-primary" />
              <p className="text-primary font-medium">核心</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">核心功能介紹</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              結合先進技術與市場數據，為您提供最佳職涯建議
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
                    <CardContent className="pt-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
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
            <div className="flex items-center gap-2 mb-2">
              <DiamondStar className="h-3 w-3 text-primary" />
              <p className="text-primary font-medium">News</p>
            </div>
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
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-2">
              <DiamondStar className="h-3 w-3 text-primary" />
              <p className="text-primary font-medium">聯絡</p>
            </div>
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