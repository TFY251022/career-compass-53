import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { to: '/', label: '首頁' },
    { to: '/team', label: '團隊介紹' },
    { to: '/faq', label: '常見問題' },
  ];

  const serviceLinks = [
    { to: '/jobs/skill-search', label: '技能搜尋' },
    { to: '/resume/optimize', label: '履歷優化' },
    { to: '/analysis/skills', label: '技能分析' },
    { to: '/jobs/recommendations', label: '職缺推薦' },
    { to: '/interview/prep', label: '面試準備' },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">職涯智慧</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              運用 AI 技術，為您打造最佳職涯發展路徑，讓求職更智慧、更高效。
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

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">聯絡方式</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@careersmart.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>(02) 1234-5678</span>
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
            © 2024 職涯智慧 CareerSmart. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              隱私權政策
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
