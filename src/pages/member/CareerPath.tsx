import { useState, useEffect, useRef } from 'react';
import { Map, ChevronRight, Star, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import RightDrawer from '@/components/panels/RightDrawer';
import LoginRequired from '@/components/gatekeeper/LoginRequired';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Career step data
const careerSteps = [
  {
    id: 1,
    step: '步驟一',
    title: '初階工程師',
    isCurrent: true,
    details: [
      '熟悉基礎程式語言',
      '參與團隊專案開發',
      '學習程式碼審查流程',
    ],
  },
  {
    id: 2,
    step: '步驟二',
    title: '中階工程師',
    isCurrent: false,
    details: [
      '獨立負責模組開發',
      '指導初階同仁',
      '參與技術決策討論',
    ],
  },
  {
    id: 3,
    step: '步驟三',
    title: '資深工程師',
    isCurrent: false,
    details: [
      '主導架構設計',
      '跨團隊技術協作',
      '制定開發規範',
    ],
  },
  {
    id: 4,
    step: '步驟四',
    title: '技術主管',
    isCurrent: false,
    details: [
      '團隊管理與培育',
      '技術路線規劃',
      '預算與資源分配',
    ],
  },
];

// Analysis history mock data
const analysisHistory = [
  {
    id: 1,
    date: '2024-01-15',
    title: '職能分析報告',
    summary: '根據您的履歷與職涯問卷，系統為您進行了全面的職能評估。',
    content: {
      strengths: ['前端開發能力優秀', 'React 框架熟練度高', '具備良好溝通能力'],
      improvements: ['可加強後端技術學習', '建議考取雲端相關證照'],
      recommendations: ['建議朝資深工程師發展', '可考慮擴展技術棧至 Node.js'],
    },
  },
  {
    id: 2,
    date: '2024-01-10',
    title: '履歷優化建議',
    summary: '針對您上傳的履歷進行深度分析，提供具體優化方向。',
    content: {
      strengths: ['工作經驗描述完整', '技能展示清晰'],
      improvements: ['建議增加量化成果', '可補充專案影響力說明'],
      recommendations: ['調整履歷格式以突出重點', '增加關鍵字密度'],
    },
  },
  {
    id: 3,
    date: '2024-01-05',
    title: '職涯發展評估',
    summary: '綜合分析您的職涯現況，規劃未來發展方向。',
    content: {
      strengths: ['目標明確', '持續學習態度佳'],
      improvements: ['需建立更廣泛的人脈網絡', '建議參與開源專案'],
      recommendations: ['3年內晉升資深工程師', '開始培養團隊管理能力'],
    },
  },
];

// Arrow Step Component - with mobile responsiveness
const ArrowStep = ({ step, isFirst, isLast, isMobile }: { step: typeof careerSteps[0]; isFirst: boolean; isLast: boolean; isMobile: boolean }) => {
  return (
    <div className={cn(
      "flex flex-col items-center",
      isMobile ? "min-w-[140px] flex-shrink-0" : "flex-1 min-w-[160px] md:min-w-[180px]"
    )}>
      {/* Arrow shape */}
      <div className={cn("relative w-full flex items-center", isMobile ? "h-10" : "h-12 md:h-14")}>
        {/* Arrow body */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            step.isCurrent
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-primary/10 text-primary"
          )}
          style={{
            clipPath: isFirst
              ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
              : isLast
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)'
              : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
          }}
        >
          <span className={cn("font-semibold pl-2", isMobile ? "text-xs" : "text-xs md:text-sm")}>{step.step}</span>
        </div>
        
        {/* Glow effect for current step */}
        {step.isCurrent && (
          <div
            className="absolute inset-0 bg-primary/20 blur-md -z-10"
            style={{
              clipPath: isFirst
                ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                : isLast
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)'
                : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
            }}
          />
        )}
      </div>
      
      {/* Title and details */}
      <div className="mt-3 md:mt-4 text-center">
        <h4 className={cn(
          "font-semibold mb-1.5 md:mb-2",
          step.isCurrent ? "text-primary" : "text-foreground",
          isMobile ? "text-xs" : "text-sm md:text-base"
        )}>
          {step.title}
        </h4>
        <ul className="space-y-0.5 md:space-y-1">
          {step.details.map((detail, idx) => (
            <li key={idx} className={cn(
              "text-muted-foreground",
              isMobile ? "text-[10px]" : "text-[10px] md:text-xs"
            )}>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Skeleton for career steps
const CareerStepsSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div className="flex gap-2 overflow-x-auto pb-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={cn(
        "flex flex-col items-center",
        isMobile ? "min-w-[140px] flex-shrink-0" : "flex-1 min-w-[160px] md:min-w-[180px]"
      )}>
        <Skeleton className={cn("w-full", isMobile ? "h-10" : "h-12 md:h-14")} />
        <Skeleton className="w-20 md:w-24 h-4 md:h-5 mt-3 md:mt-4" />
        <div className="mt-1.5 md:mt-2 space-y-1 w-full px-2 md:px-4">
          <Skeleton className="w-full h-2.5 md:h-3" />
          <Skeleton className="w-3/4 h-2.5 md:h-3 mx-auto" />
          <Skeleton className="w-5/6 h-2.5 md:h-3 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

// Analysis list skeleton
const AnalysisListSkeleton = () => (
  <div className="space-y-3 md:space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-3 md:p-4 rounded-lg border">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 md:space-y-2 flex-1">
            <Skeleton className="w-24 md:w-32 h-3 md:h-4" />
            <Skeleton className="w-36 md:w-48 h-4 md:h-5" />
            <Skeleton className="w-full h-3 md:h-4" />
          </div>
          <Skeleton className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
        </div>
      </div>
    ))}
  </div>
);

// Drawer content skeleton
const DrawerContentSkeleton = () => (
  <div className="space-y-4 md:space-y-6">
    <div>
      <Skeleton className="w-20 md:w-24 h-4 md:h-5 mb-2" />
      <Skeleton className="w-full h-3 md:h-4" />
    </div>
    <div>
      <Skeleton className="w-16 md:w-20 h-4 md:h-5 mb-2 md:mb-3" />
      <div className="space-y-2">
        <Skeleton className="w-full h-7 md:h-8 rounded-full" />
        <Skeleton className="w-4/5 h-7 md:h-8 rounded-full" />
        <Skeleton className="w-5/6 h-7 md:h-8 rounded-full" />
      </div>
    </div>
    <div>
      <Skeleton className="w-24 md:w-28 h-4 md:h-5 mb-2 md:mb-3" />
      <div className="space-y-2">
        <Skeleton className="w-full h-7 md:h-8 rounded-full" />
        <Skeleton className="w-3/4 h-7 md:h-8 rounded-full" />
      </div>
    </div>
  </div>
);

const CareerPath = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<typeof analysisHistory[0] | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const isMobile = useIsMobile();

  const roadmapRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalysisClick = (analysis: typeof analysisHistory[0]) => {
    setDrawerLoading(true);
    setSelectedAnalysis(analysis);
    setDrawerOpen(true);
    setTimeout(() => setDrawerLoading(false), 800);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Mock download completion
    }, 1500);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <LoginRequired>
      <div className="container py-6 md:py-8 animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 mb-3 md:mb-4">
            <Map className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1.5 md:mb-2">職涯地圖</h1>
          <p className="text-muted-foreground text-sm md:text-base">掌握您的職涯發展藍圖與歷史分析紀錄</p>
        </div>

        {/* Mobile: Top Navigation */}
        {isMobile && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0 text-xs"
              onClick={() => scrollToSection(roadmapRef)}
            >
              <Map className="h-3.5 w-3.5" />
              職涯階梯圖
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0 text-xs"
              onClick={() => scrollToSection(historyRef)}
            >
              <FileText className="h-3.5 w-3.5" />
              職涯分析結果
            </Button>
          </div>
        )}

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Sidebar - Hidden on Mobile, Sticky on Desktop */}
          {!isMobile && (
            <aside className="w-1/4 min-w-[180px] shrink-0 hidden md:block">
              <Card className="sticky top-24">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    導覽
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 md:space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-left text-sm"
                    onClick={() => scrollToSection(roadmapRef)}
                  >
                    <Map className="h-4 w-4" />
                    職涯階梯圖
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-left text-sm"
                    onClick={() => scrollToSection(historyRef)}
                  >
                    <FileText className="h-4 w-4" />
                    職涯分析結果
                  </Button>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Right Main Content - Scrollable */}
          <main className="flex-1 space-y-6 md:space-y-8">
            {/* Career Roadmap Section */}
            <section ref={roadmapRef}>
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    職涯階梯圖
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    您的職涯發展路徑，當前位置以發光效果標示
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <CareerStepsSkeleton isMobile={isMobile} />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex gap-1 overflow-x-auto pb-4"
                    >
                      {careerSteps.map((step, index) => (
                        <ArrowStep
                          key={step.id}
                          step={step}
                          isFirst={index === 0}
                          isLast={index === careerSteps.length - 1}
                          isMobile={isMobile}
                        />
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Analysis History Section */}
            <section ref={historyRef}>
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    職涯分析結果
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    點擊查看詳細分析內容，可下載完整報告
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <AnalysisListSkeleton />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-3 md:space-y-4"
                    >
                      {analysisHistory.map((analysis, index) => (
                        <motion.div
                          key={analysis.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 md:p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                          onClick={() => handleAnalysisClick(analysis)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5 md:space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                                {analysis.date}
                              </div>
                              <h4 className="font-semibold text-sm md:text-base truncate">{analysis.title}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                {analysis.summary}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0 ml-2" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </section>
          </main>
        </div>

        {/* Right Drawer for Analysis Details */}
        <RightDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedAnalysis?.title || ''}
          subtitle={selectedAnalysis?.date || ''}
          showDownload
          onDownload={handleDownload}
          isDownloading={isDownloading}
        >
          {drawerLoading ? (
            <DrawerContentSkeleton />
          ) : selectedAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <h4 className="font-medium mb-1.5 md:mb-2 text-sm md:text-base">分析摘要</h4>
                <p className="text-muted-foreground text-xs md:text-sm">{selectedAnalysis.summary}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                  <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  優勢亮點
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {selectedAnalysis.content.strengths.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 md:px-3 md:py-1.5 bg-primary/10 text-primary rounded-full text-xs md:text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 md:mb-3 text-sm md:text-base">待加強項目</h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {selectedAnalysis.content.improvements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 md:mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 md:mb-3 text-sm md:text-base">發展建議</h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {selectedAnalysis.content.recommendations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 md:mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </RightDrawer>
      </div>
    </LoginRequired>
  );
};

export default CareerPath;
