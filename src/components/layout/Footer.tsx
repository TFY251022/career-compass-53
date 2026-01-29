import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const quickLinks = [
    { to: '/', label: '首頁' },
    { to: '/team', label: '關於我們' },
    { to: '/faq', label: '常見問題' },
  ];

  const serviceLinks = [
    { to: '/jobs/skill-search', label: '職缺分析' },
    { to: '/resume/optimize', label: '履歷優化' },
    { to: '/jobs/recommendations', label: '職位匹配' },
    { to: '/interview/prep', label: '面試準備' },
    { to: '/analysis/skills', label: '職涯地圖' },
  ];

  const memberLinks = [
    { to: '/member/center', label: '會員中心' },
    { to: '/member/my-resumes', label: '我的履歷' },
    { to: '/member/upload-resume', label: '上傳履歷' },
    { to: '/member/career-path', label: '職涯路徑' },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <Compass className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold">職星領航員</span>
                <span className="text-xs text-muted-foreground">Career Pilot</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              運用 AI 技術，為您打造最佳職涯發展路徑。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">快速連結</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">服務項目</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member */}
          <div>
            <h4 className="font-semibold mb-4">會員專區</h4>
            <ul className="space-y-2">
              {memberLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="font-semibold mb-4">訂閱電子報</h4>
            <p className="text-sm text-muted-foreground mb-3">
              獲取最新職涯資訊與平台更新
            </p>
            <div className="flex gap-2 mb-6">
              <Input 
                type="email" 
                placeholder="輸入電子郵件" 
                className="text-sm"
              />
              <Button size="sm" className="gradient-primary shrink-0">
                訂閱
              </Button>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@careerpilot.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+886 2 1234 5678</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>台北市信義區信義路五段7號</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Career Pilot 職星領航員. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              隱私政策
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              服務條款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
