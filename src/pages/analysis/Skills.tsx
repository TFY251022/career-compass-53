 import { useState, useEffect, useRef } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { 
   Radar, 
   FileText, 
   BookOpen, 
   Lightbulb, 
   Target, 
   TrendingUp, 
   Download, 
   Star,
   ExternalLink,
   ChevronRight
 } from 'lucide-react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { Skeleton } from '@/components/ui/skeleton';
 import { AILoadingSpinner, ContentTransition } from '@/components/loading/LoadingStates';
 import { motion } from 'framer-motion';
 import { useAppState } from '@/contexts/AppContext';
 import AuthModal from '@/components/auth/AuthModal';
 import GatekeeperOverlay from '@/components/gatekeeper/GatekeeperOverlay';
 import {
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
   ResponsiveContainer,
   Legend,
   Radar as RechartsRadar,
 } from 'recharts';
 
 // Sidebar navigation items
 const sidebarItems = [
   { id: 'radar', label: '職能雷達圖', icon: Radar },
   { id: 'gap', label: '職能差距分析', icon: Target },
   { id: 'learning', label: '學習資源推薦', icon: BookOpen },
   { id: 'projects', label: 'Side Project 推薦', icon: Lightbulb },
 ];
 
 // Radar chart data
 const radarData = [
   { dimension: '前端開發', user: 85, target: 90 },
   { dimension: '後端開發', user: 65, target: 80 },
   { dimension: '運維部署', user: 50, target: 70 },
   { dimension: 'AI與數據', user: 40, target: 60 },
   { dimension: '工程品質', user: 75, target: 85 },
   { dimension: '軟實力', user: 80, target: 75 },
 ];
 
 // Gap analysis data
 const gapAnalysis = {
   selfAssessment: '中階工程師',
   aiAssessment: '資深工程師',
   matchPercentage: 78,
   targetPosition: '全端資深工程師',
   cognitiveBias: '您對運維部署的能力略有高估，建議多參與實際部署專案來累積經驗。',
   summary: '您的後端技術已達標，但在運維部署上仍有 20% 的成長空間，是晉升資深工程師的關鍵。',
   gaps: [
     { skill: '容器化技術', current: 50, target: 70, priority: '高' },
     { skill: 'CI/CD 流程', current: 45, target: 75, priority: '高' },
     { skill: '雲端架構', current: 55, target: 80, priority: '中' },
     { skill: '資料庫優化', current: 60, target: 75, priority: '中' },
   ],
 };
 
 // Learning resources
 const learningResources = [
   {
     title: 'Docker & Kubernetes 實戰課程',
     description: '從零開始學習容器化技術，涵蓋 Docker 基礎到 K8s 集群管理',
     tags: ['DevOps', '容器化', '熱門'],
     link: '#',
   },
   {
     title: 'AWS 雲端架構師認證指南',
     description: '系統性學習雲端服務，準備 AWS SAA 認證考試',
     tags: ['雲端', 'AWS', '認證'],
     link: '#',
   },
   {
     title: '高效能 PostgreSQL 優化技巧',
     description: '深入了解資料庫索引設計與查詢優化策略',
     tags: ['資料庫', 'SQL', '進階'],
     link: '#',
   },
   {
     title: 'GitHub Actions CI/CD 完整教學',
     description: '建立自動化測試與部署流程，提升開發效率',
     tags: ['CI/CD', 'DevOps', '實用'],
     link: '#',
   },
 ];
 
 // Side project recommendations
 const sideProjects = [
   {
     name: '個人 DevOps 實驗室',
     technologies: ['Docker', 'K8s', 'GitHub Actions'],
     highlights: '建立完整的 CI/CD 流程，從程式碼提交到自動部署',
     difficulty: 4,
   },
   {
     name: '微服務電商平台',
     technologies: ['Node.js', 'PostgreSQL', 'Redis'],
     highlights: '實作分散式系統架構，練習服務間通訊與資料一致性',
     difficulty: 5,
   },
   {
     name: '即時數據儀表板',
     technologies: ['React', 'WebSocket', 'Chart.js'],
     highlights: '結合前端視覺化與即時數據串流，強化全端技能',
     difficulty: 3,
   },
   {
     name: '智慧日誌分析系統',
     technologies: ['Python', 'Elasticsearch', 'Kibana'],
     highlights: '學習日誌收集與分析，提升運維能力',
     difficulty: 4,
   },
 ];
 
 // Skeleton components
 const RadarChartSkeleton = () => (
   <div className="space-y-4">
     <Skeleton className="h-8 w-48" />
     <div className="flex items-center justify-center h-80">
       <div className="relative">
         <Skeleton className="h-64 w-64 rounded-full" />
         <Skeleton className="absolute inset-4 h-56 w-56 rounded-full" />
         <Skeleton className="absolute inset-8 h-48 w-48 rounded-full" />
       </div>
     </div>
     <Skeleton className="h-20 w-full rounded-lg" />
   </div>
 );
 
 const GapAnalysisSkeleton = () => (
   <div className="space-y-4">
     <Skeleton className="h-8 w-48" />
     <div className="grid grid-cols-2 gap-4">
       <Skeleton className="h-24 w-full rounded-lg" />
       <Skeleton className="h-24 w-full rounded-lg" />
     </div>
     <Skeleton className="h-32 w-full rounded-lg" />
     <div className="space-y-3">
       {[1, 2, 3, 4].map((i) => (
         <Skeleton key={i} className="h-16 w-full rounded-lg" />
       ))}
     </div>
   </div>
 );
 
 const ResourcesSkeleton = () => (
   <div className="space-y-4">
     <Skeleton className="h-8 w-48" />
     <Skeleton className="h-16 w-full rounded-lg" />
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {[1, 2, 3, 4].map((i) => (
         <Skeleton key={i} className="h-40 w-full rounded-lg" />
       ))}
     </div>
   </div>
 );
 
 const ProjectsSkeleton = () => (
   <div className="space-y-4">
     <Skeleton className="h-8 w-48" />
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {[1, 2, 3, 4].map((i) => (
         <Skeleton key={i} className="h-48 w-full rounded-lg" />
       ))}
     </div>
   </div>
 );
 
 const Skills = () => {
   const navigate = useNavigate();
   const { isLoggedIn, isResumeUploaded, isPersonalityQuizDone } = useAppState();
   
   const [isLoading, setIsLoading] = useState(true);
   const [activeSection, setActiveSection] = useState('radar');
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [showGatekeeper, setShowGatekeeper] = useState(false);
   
   // Section refs for scroll-linked navigation
   const sectionRefs = {
     radar: useRef<HTMLDivElement>(null),
     gap: useRef<HTMLDivElement>(null),
     learning: useRef<HTMLDivElement>(null),
     projects: useRef<HTMLDivElement>(null),
   };
 
   // Access control check
   useEffect(() => {
     if (!isLoggedIn) {
       setShowAuthModal(true);
     } else if (!isResumeUploaded || !isPersonalityQuizDone) {
       setShowGatekeeper(true);
     } else {
       // Simulate data loading
       const loadData = async () => {
         setIsLoading(true);
         await new Promise(resolve => setTimeout(resolve, 2000));
         setIsLoading(false);
       };
       loadData();
     }
   }, [isLoggedIn, isResumeUploaded, isPersonalityQuizDone]);
 
   // Handle auth modal close
   const handleAuthModalClose = (open: boolean) => {
     setShowAuthModal(open);
     if (!open && !isLoggedIn) {
       navigate(-1);
     }
   };
 
   // Handle gatekeeper close
   const handleGatekeeperClose = (open: boolean) => {
     setShowGatekeeper(open);
   };
 
   // Handle gatekeeper login click
   const handleGatekeeperLoginClick = () => {
     setShowGatekeeper(false);
     setShowAuthModal(true);
   };
 
   // Scroll to section
   const scrollToSection = (sectionId: string) => {
     const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
     if (ref.current) {
       const offset = 100; // Account for fixed header
       const top = ref.current.offsetTop - offset;
       window.scrollTo({ top, behavior: 'smooth' });
       setActiveSection(sectionId);
     }
   };
 
   // Track active section on scroll
   useEffect(() => {
     const handleScroll = () => {
       const scrollPosition = window.scrollY + 150;
       
       for (const [id, ref] of Object.entries(sectionRefs)) {
         if (ref.current) {
           const offsetTop = ref.current.offsetTop;
           const offsetBottom = offsetTop + ref.current.offsetHeight;
           
           if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
             setActiveSection(id);
             break;
           }
         }
       }
     };
 
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
   }, []);
 
   // Download report
   const handleDownloadReport = () => {
     const reportContent = `
 職能分析報告
 ================
 
 一、整體評估
 ${gapAnalysis.summary}
 
 二、職能雷達圖數據
 ${radarData.map(d => `- ${d.dimension}: 當前 ${d.user}% / 目標 ${d.target}%`).join('\n')}
 
 三、職能差距分析
 - 自評職級: ${gapAnalysis.selfAssessment}
 - AI 評估職級: ${gapAnalysis.aiAssessment}
 - 匹配度: ${gapAnalysis.matchPercentage}%
 - 目標職位: ${gapAnalysis.targetPosition}
 
 認知偏差說明:
 ${gapAnalysis.cognitiveBias}
 
 優先改善項目:
 ${gapAnalysis.gaps.map(g => `- ${g.skill}: 當前 ${g.current}% → 目標 ${g.target}% (優先級: ${g.priority})`).join('\n')}
 
 四、推薦學習資源
 ${learningResources.map(r => `- ${r.title}: ${r.description}`).join('\n')}
 
 五、推薦 Side Project
 ${sideProjects.map(p => `- ${p.name} (技術: ${p.technologies.join(', ')})`).join('\n')}
     `.trim();
 
     const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = '職能分析報告.txt';
     a.click();
     URL.revokeObjectURL(url);
   };
 
   // Render difficulty stars
   const renderDifficulty = (level: number) => {
     return (
       <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((i) => (
           <Star
             key={i}
             className={`h-4 w-4 ${i <= level ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
           />
         ))}
       </div>
     );
   };
 
   return (
     <>
       <AuthModal open={showAuthModal} onOpenChange={handleAuthModalClose} />
       <GatekeeperOverlay 
         open={showGatekeeper} 
         onOpenChange={handleGatekeeperClose}
         onLoginClick={handleGatekeeperLoginClick}
       />
 
       <div className="min-h-screen bg-background">
         {/* Header */}
         <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
           <div className="container py-6">
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                 <Radar className="h-6 w-6 text-primary" />
               </div>
               <div>
                 <h1 className="text-2xl font-bold">職能圖譜分析</h1>
                 <p className="text-muted-foreground">深入分析您的技能優勢與發展潛力</p>
               </div>
             </div>
           </div>
         </div>
 
         <div className="container py-8">
           <div className="flex gap-8">
             {/* Sticky Sidebar - 25% */}
             <aside className="hidden lg:block w-1/4 shrink-0">
               <div className="sticky top-32 space-y-2">
                 <p className="text-sm font-medium text-muted-foreground mb-4 px-3">快速導覽</p>
                 {sidebarItems.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => scrollToSection(item.id)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                       activeSection === item.id
                         ? 'bg-primary/10 text-primary border-l-4 border-primary'
                         : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                     }`}
                   >
                     <item.icon className="h-5 w-5" />
                     <span className="font-medium">{item.label}</span>
                     {activeSection === item.id && (
                       <ChevronRight className="h-4 w-4 ml-auto" />
                     )}
                   </button>
                 ))}
 
                 {/* Download Button in Sidebar */}
                 {!isLoading && (
                   <div className="pt-6">
                     <Button 
                       className="w-full gradient-primary gap-2"
                       onClick={handleDownloadReport}
                     >
                       <FileText className="h-4 w-4" />
                       下載分析報告
                     </Button>
                   </div>
                 )}
               </div>
             </aside>
 
             {/* Main Content - 75% */}
             <main className="flex-1 space-y-16">
               {/* Section 1: Radar Chart */}
               <section ref={sectionRefs.radar} id="radar" className="scroll-mt-32">
                 <ContentTransition
                   isLoading={isLoading}
                   skeleton={<RadarChartSkeleton />}
                 >
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-6"
                   >
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                         <Radar className="h-5 w-5 text-primary" />
                       </div>
                       <h2 className="text-xl font-bold">職能雷達圖</h2>
                     </div>
 
                     <Card className="transition-all duration-300 hover:shadow-medium">
                       <CardContent className="pt-6">
                         <div className="h-80">
                           <ResponsiveContainer width="100%" height="100%">
                             <RadarChart data={radarData}>
                               <PolarGrid stroke="hsl(var(--border))" />
                               <PolarAngleAxis 
                                 dataKey="dimension" 
                                 tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                               />
                               <PolarRadiusAxis 
                                 angle={30} 
                                 domain={[0, 100]}
                                 tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                               />
                               {/* Target Layer - Light gray/transparent green */}
                               <RechartsRadar
                                 name="目標職缺"
                                 dataKey="target"
                                 stroke="hsl(152 30% 60%)"
                                 fill="hsl(152 30% 70%)"
                                 fillOpacity={0.3}
                                 strokeWidth={2}
                                 strokeDasharray="5 5"
                               />
                               {/* User Layer - Brand green with glow */}
                               <RechartsRadar
                                 name="您的職能"
                                 dataKey="user"
                                 stroke="hsl(152 69% 45%)"
                                 fill="hsl(152 69% 45%)"
                                 fillOpacity={0.5}
                                 strokeWidth={3}
                               />
                               <Legend />
                             </RadarChart>
                           </ResponsiveContainer>
                         </div>
                       </CardContent>
                     </Card>
 
                     {/* Global Summary Callout */}
                     <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
                       <div className="flex items-start gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                           <TrendingUp className="h-5 w-5 text-primary" />
                         </div>
                         <div>
                           <p className="font-semibold text-foreground mb-1">整體評估結果</p>
                           <p className="text-muted-foreground leading-relaxed">
                             {gapAnalysis.summary}
                           </p>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 </ContentTransition>
               </section>
 
               {/* Section 2: Gap Analysis */}
               <section ref={sectionRefs.gap} id="gap" className="scroll-mt-32">
                 <ContentTransition
                   isLoading={isLoading}
                   skeleton={<GapAnalysisSkeleton />}
                 >
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1 }}
                     className="space-y-6"
                   >
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                         <Target className="h-5 w-5 text-primary" />
                       </div>
                       <h2 className="text-xl font-bold">職能差距分析</h2>
                     </div>
 
                     {/* Assessment Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Card className="transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                         <CardContent className="pt-6">
                           <p className="text-sm text-muted-foreground mb-2">自評職級</p>
                           <p className="text-2xl font-bold text-foreground">
                             {gapAnalysis.selfAssessment}
                           </p>
                         </CardContent>
                       </Card>
                       <Card className="transition-all duration-300 hover:shadow-medium hover:-translate-y-1 border-primary/30 bg-primary/5">
                         <CardContent className="pt-6">
                           <p className="text-sm text-muted-foreground mb-2">AI 評估職級</p>
                           <p className="text-2xl font-bold text-primary">
                             {gapAnalysis.aiAssessment}
                           </p>
                         </CardContent>
                       </Card>
                     </div>
 
                     {/* Match Percentage & Target */}
                     <Card className="transition-all duration-300 hover:shadow-medium">
                       <CardContent className="pt-6 space-y-4">
                         <div className="flex items-center justify-between">
                           <div>
                             <p className="text-sm text-muted-foreground">目標職位</p>
                             <p className="text-lg font-semibold">{gapAnalysis.targetPosition}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm text-muted-foreground">匹配度</p>
                             <p className="text-3xl font-bold text-primary">{gapAnalysis.matchPercentage}%</p>
                           </div>
                         </div>
                         <Progress value={gapAnalysis.matchPercentage} className="h-3" />
                         
                         <div className="p-4 bg-muted/30 rounded-lg">
                           <p className="text-sm font-medium mb-1">認知偏差說明</p>
                           <p className="text-sm text-muted-foreground">{gapAnalysis.cognitiveBias}</p>
                         </div>
                       </CardContent>
                     </Card>
 
                     {/* Gap Details */}
                     <Card>
                       <CardHeader>
                         <CardTitle className="text-lg">落差分析報告</CardTitle>
                         <CardDescription>依優先級排序的技能提升項目</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         {gapAnalysis.gaps.map((gap, index) => (
                           <motion.div
                             key={gap.skill}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: index * 0.1 }}
                             className="p-4 rounded-lg border bg-card hover:shadow-soft transition-all duration-300"
                           >
                             <div className="flex items-center justify-between mb-3">
                               <span className="font-medium">{gap.skill}</span>
                               <Badge variant={gap.priority === '高' ? 'default' : 'secondary'}>
                                 {gap.priority}優先
                               </Badge>
                             </div>
                             <div className="space-y-2">
                               <div className="flex justify-between text-sm text-muted-foreground">
                                 <span>當前: {gap.current}%</span>
                                 <span>目標: {gap.target}%</span>
                               </div>
                               <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                 <div 
                                   className="absolute h-full bg-primary/30 rounded-full"
                                   style={{ width: `${gap.target}%` }}
                                 />
                                 <div 
                                   className="absolute h-full bg-primary rounded-full"
                                   style={{ width: `${gap.current}%` }}
                                 />
                               </div>
                             </div>
                           </motion.div>
                         ))}
                       </CardContent>
                     </Card>
                   </motion.div>
                 </ContentTransition>
               </section>
 
               {/* Section 3: Learning Resources */}
               <section ref={sectionRefs.learning} id="learning" className="scroll-mt-32">
                 <ContentTransition
                   isLoading={isLoading}
                   skeleton={<ResourcesSkeleton />}
                 >
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="space-y-6"
                   >
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                         <BookOpen className="h-5 w-5 text-primary" />
                       </div>
                       <h2 className="text-xl font-bold">學習資源推薦</h2>
                     </div>
 
                     {/* Action Plan Introduction */}
                     <div className="p-5 rounded-xl gradient-light border">
                       <h3 className="font-semibold mb-2">📋 行動計畫</h3>
                       <p className="text-muted-foreground">
                         根據您的職能差距分析，我們為您精選以下學習資源。建議優先完成「高優先」技能的相關課程，
                         每週投入 5-10 小時，預計 3-6 個月內可達成目標職位的技能要求。
                       </p>
                     </div>
 
                     {/* Resource Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {learningResources.map((resource, index) => (
                         <motion.div
                           key={resource.title}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                         >
                           <Card className="h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1 group cursor-pointer">
                             <CardContent className="pt-6 h-full flex flex-col">
                               <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                 {resource.title}
                               </h3>
                               <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                 {resource.description}
                               </p>
                               <div className="flex items-center justify-between">
                                 <div className="flex flex-wrap gap-1">
                                   {resource.tags.map((tag) => (
                                     <Badge key={tag} variant="secondary" className="text-xs">
                                       {tag}
                                     </Badge>
                                   ))}
                                 </div>
                                 <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                               </div>
                             </CardContent>
                           </Card>
                         </motion.div>
                       ))}
                     </div>
                   </motion.div>
                 </ContentTransition>
               </section>
 
               {/* Section 4: Side Projects */}
               <section ref={sectionRefs.projects} id="projects" className="scroll-mt-32">
                 <ContentTransition
                   isLoading={isLoading}
                   skeleton={<ProjectsSkeleton />}
                 >
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="space-y-6"
                   >
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                         <Lightbulb className="h-5 w-5 text-primary" />
                       </div>
                       <h2 className="text-xl font-bold">Side Project 推薦</h2>
                     </div>
 
                     {/* Project Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {sideProjects.map((project, index) => (
                         <motion.div
                           key={project.name}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                         >
                           <Card className="h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                             <CardContent className="pt-6 h-full flex flex-col">
                               <h3 className="font-semibold text-lg mb-3">{project.name}</h3>
                               
                               {/* Technologies */}
                               <div className="flex flex-wrap gap-1 mb-4">
                                 {project.technologies.map((tech) => (
                                   <Badge key={tech} variant="outline" className="text-xs">
                                     {tech}
                                   </Badge>
                                 ))}
                               </div>
                               
                               {/* Highlights */}
                               <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                 {project.highlights}
                               </p>
                               
                               {/* Difficulty */}
                               <div className="flex items-center justify-between pt-3 border-t">
                                 <span className="text-sm text-muted-foreground">實作難度</span>
                                 {renderDifficulty(project.difficulty)}
                               </div>
                             </CardContent>
                           </Card>
                         </motion.div>
                       ))}
                     </div>
                   </motion.div>
                 </ContentTransition>
               </section>
 
               {/* Mobile Download Button */}
               {!isLoading && (
                 <div className="lg:hidden pt-8">
                   <Button 
                     className="w-full gradient-primary gap-2"
                     onClick={handleDownloadReport}
                   >
                     <Download className="h-4 w-4" />
                     下載分析報告
                   </Button>
                 </div>
               )}
             </main>
           </div>
         </div>
       </div>
     </>
   );
 };
 
 export default Skills;
