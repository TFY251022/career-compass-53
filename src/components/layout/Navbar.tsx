import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Briefcase, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  User, 
  Menu,
  LogOut,
  Settings,
  FileUp
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAppState();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/jobs/skill-search', label: '技能搜尋', icon: Briefcase },
    { to: '/resume/optimize', label: '履歷優化', icon: FileText },
    { to: '/analysis/skills', label: '技能分析', icon: BarChart3 },
    { to: '/interview/prep', label: '面試準備', icon: MessageSquare },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            職涯<span className="text-gradient">智慧</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant="ghost" className="gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  會員中心
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/member/center" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    會員中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/member/my-resumes" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    我的履歷
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/member/upload-resume" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    上傳履歷
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/member/career-path" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    職涯路徑
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/member/password" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    密碼設定
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth/register-form">
                <Button variant="ghost">註冊</Button>
              </Link>
              <Button onClick={() => setIsLoggedIn(true)} className="gradient-primary">
                登入
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <link.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {isLoggedIn ? (
                <>
                  <Link
                    to="/member/center"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">會員中心</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">登出</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/auth/register-form" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">註冊</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setIsLoggedIn(true);
                      setMobileOpen(false);
                    }}
                    className="w-full gradient-primary"
                  >
                    登入
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
