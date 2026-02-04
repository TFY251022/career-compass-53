import { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Banknote, Filter, ExternalLink, ChevronLeft, ChevronRight, Briefcase, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/contexts/AppContext';
import GatekeeperOverlay from '@/components/gatekeeper/GatekeeperOverlay';
import AuthModal from '@/components/auth/AuthModal';
import icon104 from '@/assets/104-icon.png';

// Mock job data generator
const generateMockJobs = (page: number) => {
  const industries = ['科技業', '金融業', '製造業', '服務業', '零售業', '醫療業', '教育業', '電商業'];
  const cities = ['台北市', '新北市', '桃園市', '台中市', '高雄市', '新竹市', '台南市'];
  const positions = [
    { title: '資深前端工程師', desc: '負責開發與維護企業級 Web 應用程式，追求卓越使用者體驗' },
    { title: '產品經理', desc: '主導產品策略規劃，協調跨部門資源達成商業目標' },
    { title: 'UI/UX 設計師', desc: '打造直覺且美觀的數位產品介面，提升品牌價值' },
    { title: '數據分析師', desc: '運用大數據技術挖掘商業洞察，驅動決策優化' },
    { title: '後端工程師', desc: '設計與開發高效能的伺服器端架構與 API 服務' },
    { title: '專案經理', desc: '統籌專案時程與資源，確保如期交付高品質成果' },
    { title: '行銷企劃', desc: '策劃創新行銷活動，擴大品牌影響力與市場覆蓋' },
    { title: '人資專員', desc: '負責人才招募與培訓發展，打造優質企業文化' },
    { title: 'DevOps 工程師', desc: '建構與維護 CI/CD 流程，確保系統穩定與高可用性' },
    { title: '業務主管', desc: '帶領業務團隊開拓市場，達成營收成長目標' },
  ];
  const companies = ['科技新創', '金融集團', '跨國企業', '本土龍頭', '上市公司', '獨角獸', '百年老店', '新興品牌'];
  
  return positions.map((pos, idx) => ({
    id: (page - 1) * 10 + idx + 1,
    title: pos.title,
    description: pos.desc,
    company: `${companies[idx % companies.length]}股份有限公司`,
    city: cities[idx % cities.length],
    salary: `${40 + idx * 5}K - ${60 + idx * 8}K`,
    industry: industries[idx % industries.length],
    externalUrl: 'https://www.104.com.tw',
  }));
};

// Job Card Skeleton Component
const JobCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

// Job Card Component
interface JobData {
  id: number;
  title: string;
  description: string;
  company: string;
  city: string;
  salary: string;
  industry: string;
  externalUrl: string;
}

const JobCard = ({ job }: { job: JobData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="overflow-hidden hover:shadow-medium hover:-translate-y-1 transition-all duration-300 group border-border hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{job.company}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img 
              src={icon104} 
              alt="104人力銀行" 
              className="h-8 w-8 rounded-full shadow-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.city}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Banknote className="h-3 w-3" />
            {job.salary}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {job.industry}
          </Badge>
        </div>

        <div className="flex gap-3 pt-2">
          <Link to={`/jobs/${job.id}`}>
            <Button size="sm" className="gap-1">
              查看詳細
            </Button>
          </Link>
          <a 
            href={job.externalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="gap-1">
              立即投遞
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Recommendations = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn, isResumeUploaded, isPersonalityQuizDone, isJobPreferenceQuizDone } = useAppState();
  
  // Access control states
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Initialize page from URL params
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
  
  // Page states
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages] = useState(5); // Mock 5 pages
  
  // Filter states
  const [keyword, setKeyword] = useState('');
  const [salaryRange, setSalaryRange] = useState([30, 150]);
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '', salaryRange: [30, 150] });

  // Check access control
  useEffect(() => {
    const allConditionsMet = isLoggedIn && isResumeUploaded && isPersonalityQuizDone && isJobPreferenceQuizDone;
    if (!allConditionsMet) {
      setShowGatekeeper(true);
    } else {
      setShowGatekeeper(false);
    }
  }, [isLoggedIn, isResumeUploaded, isPersonalityQuizDone, isJobPreferenceQuizDone]);

  // Load jobs with skeleton simulation
  const loadJobs = (page: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockJobs = generateMockJobs(page);
      setJobs(mockJobs);
      setIsLoading(false);
    }, 1200);
  };

  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Update URL params
    setSearchParams({ page: page.toString() });
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ keyword, salaryRange });
    setCurrentPage(1);
    setSearchParams({ page: '1' });
    loadJobs(1);
  };
  
  // Sync page state when URL params change (browser back/forward)
  useEffect(() => {
    const urlPageParam = parseInt(searchParams.get('page') || '1', 10);
    const validPage = isNaN(urlPageParam) || urlPageParam < 1 ? 1 : Math.min(urlPageParam, totalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }
  }, [searchParams, totalPages]);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const handleGatekeeperClose = (isOpen: boolean) => {
    setShowGatekeeper(isOpen);
    if (!isOpen) {
      navigate(-1);
    }
  };

  const handleAuthModalClose = (isOpen: boolean) => {
    setShowAuthModal(isOpen);
    if (!isOpen && !isLoggedIn) {
      navigate(-1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Header Section */}
        <div className="container py-12">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full gradient-primary mb-6 shadow-medium">
              <Star className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">為您推薦的專屬職缺</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              我們根據您的履歷、個性特質與工作偏好，精心挑選最適合您的職位機會
            </p>
          </motion.div>

          {/* Filter Section */}
          <motion.div 
            className="bg-card rounded-xl border shadow-soft p-6 mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Keyword Search */}
              <div className="md:col-span-5">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  關鍵字搜尋
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="職位名稱、公司、技能..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div className="md:col-span-5">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  薪資範圍 (K)
                </label>
                <div className="px-2">
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    min={30}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{salaryRange[0]}K</span>
                    <span>{salaryRange[1]}K+</span>
                  </div>
                </div>
              </div>

              {/* Filter Button */}
              <div className="md:col-span-2">
                <Button 
                  onClick={handleApplyFilters}
                  className="w-full gap-2"
                >
                  <Filter className="h-4 w-4" />
                  篩選
                </Button>
              </div>
            </div>

            {/* Applied Filters Display */}
            {(appliedFilters.keyword || appliedFilters.salaryRange[0] !== 30 || appliedFilters.salaryRange[1] !== 150) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">目前篩選：</span>
                {appliedFilters.keyword && (
                  <Badge variant="secondary">關鍵字: {appliedFilters.keyword}</Badge>
                )}
                <Badge variant="secondary">
                  薪資: {appliedFilters.salaryRange[0]}K - {appliedFilters.salaryRange[1]}K
                </Badge>
              </div>
            )}
          </motion.div>

          {/* Job List */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isLoading && (
              <motion.div 
                className="flex justify-center items-center gap-2 mt-10 pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一頁
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, idx) => (
                    typeof page === 'number' ? (
                      <Button
                        key={idx}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ) : (
                      <span key={idx} className="flex items-center justify-center w-10 text-muted-foreground">
                        {page}
                      </span>
                    )
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  下一頁
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Gatekeeper Overlay */}
      <GatekeeperOverlay
        open={showGatekeeper}
        onOpenChange={handleGatekeeperClose}
        onLoginClick={handleLoginClick}
      />

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={handleAuthModalClose}
      />
    </>
  );
};

export default Recommendations;
