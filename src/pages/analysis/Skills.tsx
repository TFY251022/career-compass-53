import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Info,
  ArrowLeft,
  ScanSearch,
  RefreshCw,
  Shield,
  AlertTriangle,
  Zap,
  ShieldAlert,
  CircleDot,
  Clock,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@/assets/logo.png";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Radar as RechartsRadar,
} from "recharts";
import { useResumes } from "@/contexts/ResumeContext";
import { getMyUserId } from "@/services/memberService";
import { generateAnalysis } from "@/services/analysisService";
import type { AnalysisResult } from "@/types/analysis";
import { parseSWOT } from "@/types/analysis";
import { mockAnalysisResult } from "@/mocks/analysis";

const ANALYSIS_DONE_KEY = "skills-analysis-done";
const ANALYSIS_RESULT_KEY = "skills-analysis-result";

const loadingMessages = [
  "正在解析履歷關鍵字...",
  "正在匹配人格特質...",
  "正在比對目標職位需求...",
  "正在計算職能落差...",
  "正在生成個人化建議...",
];

type AnalysisPhase = "idle" | "loading" | "done";
type SubView = "main" | "learning" | "sideproject";

// ── Mascot mapping by keyword ──
const mascotMap: Record<string, string> = {
  前端: "/mascots/frontend.png",
  後端: "/mascots/backend.png",
  全端: "/mascots/fullstack.png",
  資料: "/mascots/data.png",
  AI: "/mascots/ai.png",
  演算法: "/mascots/ai.png",
  DevOps: "/mascots/devops.png",
  SRE: "/mascots/devops.png",
};

function getMascotForRole(role: string): string {
  for (const [key, src] of Object.entries(mascotMap)) {
    if (role.includes(key)) return src;
  }
  return "/mascots/fullstack.png";
}

const Skills = () => {
  const navigate = useNavigate();
  const { resumes } = useResumes();

  const [phase, setPhase] = useState<AnalysisPhase>(() =>
    localStorage.getItem(ANALYSIS_DONE_KEY) === "true" ? "done" : "idle"
  );
  const [subView, setSubView] = useState<SubView>("main");
  const [subViewLoading, setSubViewLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(() => {
    try {
      const saved = localStorage.getItem(ANALYSIS_RESULT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockAnalysisResult;
  });

  // Derived
  const { report_metadata, preliminary_summary, radar_chart, gap_analysis, learningResources, sideProjects } = analysisResult ?? {};
  const swot = useMemo(() => parseSWOT(gap_analysis?.target_position?.gap_description ?? ''), [gap_analysis?.target_position?.gap_description]);
  const mascotSrc = getMascotForRole(gap_analysis?.target_position?.role ?? '');

  const latestResumeId = useMemo(() => {
    if (resumes.length === 0) return null;
    const sorted = [...resumes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return sorted[0].id;
  }, [resumes]);

  const startAnalysis = useCallback(async () => {
    setPhase("loading");
    const userId = await getMyUserId();
    const resumeId = latestResumeId;

    const animationPromise = (async () => {
      for (let i = 0; i < loadingMessages.length; i++) {
        setLoadingMsg(loadingMessages[i]);
        await new Promise((r) => setTimeout(r, 1200));
      }
    })();

    const apiPromise = generateAnalysis({ user_id: userId, resume_id: resumeId ?? 0 });
    const [, result] = await Promise.all([animationPromise, apiPromise]);

    setAnalysisResult(result);
    localStorage.setItem(ANALYSIS_RESULT_KEY, JSON.stringify(result));
    localStorage.setItem(ANALYSIS_DONE_KEY, "true");
    setPhase("done");
  }, [latestResumeId]);

  const handleReAnalyse = useCallback(() => {
    localStorage.removeItem(ANALYSIS_DONE_KEY);
    localStorage.removeItem(ANALYSIS_RESULT_KEY);
    startAnalysis();
  }, [startAnalysis]);

  const openSubView = async (view: SubView) => {
    setSubViewLoading(true);
    setSubView(view);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubViewLoading(false);
  };

  const radarChartRef = useRef<HTMLDivElement>(null);

  const handleDownloadReport = async () => {
    const { exportHtmlToPdf, buildSkillsReportHtml } = await import("@/utils/pdfExport");
    await exportHtmlToPdf({
      filename: "職能分析報告.pdf",
      htmlContent: buildSkillsReportHtml({
        coreInsight: preliminary_summary?.core_insight ?? '',
        radarDimensions: radar_chart?.dimensions ?? [],
        selfAssessment: gap_analysis?.current_status?.self_assessment ?? '',
        actualLevel: gap_analysis?.current_status?.actual_level ?? '',
        cognitiveBias: gap_analysis?.current_status?.cognitive_bias ?? '',
        targetRole: gap_analysis?.target_position?.role ?? '',
        matchScore: gap_analysis?.target_position?.match_score ?? 0,
        gapDescription: gap_analysis?.target_position?.gap_description ?? '',
        actionPlan: gap_analysis?.action_plan ?? { short_term: '', mid_term: '', long_term: '' },
        learningResources,
        sideProjects,
      }),
    });
  };

  const renderDifficulty = (level: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= level ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );

  // ── Learning Resources Sub-view ──
  if (subView === "learning") {
    return (
      <div className="min-h-screen bg-card">
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" className="gap-2 text-[#502D03] hover:text-foreground" onClick={() => setSubView("main")}>
              <ArrowLeft className="h-4 w-4" /> 返回職能圖譜
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownloadReport}>
              <Download className="h-5 w-5 text-[#502D03]" />
            </Button>
          </div>
          {subViewLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img src={logoImage} alt="載入中" className="h-16 w-16 object-contain animate-pulse" />
              <p className="mt-4 text-[#8d4903] animate-pulse">正在載入學習資源...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">學習資源推薦</h1>
              <p className="text-muted-foreground">
                根據您的職能差距分析，我們為您精選以下學習資源。建議優先完成「高優先」技能的相關課程，每週投入 5-10 小時，預計 3-6 個月內可達成目標職位的技能要求。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningResources.map((resource, index) => (
                  <motion.div key={resource.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="h-full bg-white transition-all duration-300 hover:shadow-medium hover:-translate-y-1 group cursor-pointer">
                      <CardContent className="pt-6 h-full flex flex-col">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
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
          )}
        </div>
      </div>
    );
  }

  // ── Side Project Sub-view ──
  if (subView === "sideproject") {
    return (
      <div className="min-h-screen bg-card">
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" className="gap-2 text-[#502D03] hover:text-foreground" onClick={() => setSubView("main")}>
              <ArrowLeft className="h-4 w-4" /> 返回職能圖譜
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownloadReport}>
              <Download className="h-5 w-5 text-[#502D03]" />
            </Button>
          </div>
          {subViewLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img src={logoImage} alt="載入中" className="h-16 w-16 object-contain animate-pulse" />
              <p className="mt-4 text-[#8d4903] animate-pulse">正在載入 Side Project 推薦...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Side Project 推薦</h1>
              <p className="text-muted-foreground">
                實作 Side Project 是提升技術深度最有效的方式。以下專案根據您的職能落差量身推薦，建議從低難度開始逐步挑戰。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sideProjects.map((project, index) => (
                  <motion.div key={project.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="h-full bg-white transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                      <CardContent className="pt-6 h-full flex flex-col">
                        <h3 className="font-semibold text-lg mb-3">{project.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">{project.highlights}</p>
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
          )}
        </div>
      </div>
    );
  }

  // ── Pre-Analysis (idle) State ──
  if (phase === "idle") {
    return (
      <div className="min-h-screen">
        <div className="container py-8 md:py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
              <Radar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">職能圖譜</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">深入分析您的技能優勢與發展潛力</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center py-16">
            <Card className="max-w-lg w-full shadow-warm">
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-[#fbf1e8] flex items-center justify-center">
                  <ScanSearch className="h-10 w-10 text-[#8d4903]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">準備分析</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                    系統將根據您的履歷、職涯問卷與人格特質進行綜合分析。
                  </p>
                </div>
                <button
                  onClick={startAnalysis}
                  className="px-8 py-4 rounded-xl font-semibold text-white gradient-primary shadow-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-large hover:brightness-110 flex items-center justify-center gap-3"
                >
                  <Radar className="h-5 w-5" /> 開始職能深度分析
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Loading State ──
  if (phase === "loading") {
    return (
      <div className="min-h-screen">
        <div className="container py-8 md:py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
              <Radar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">職能圖譜</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">深入分析您的技能優勢與發展潛力</p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 space-y-8">
            <motion.img src={logoImage} alt="分析中" className="h-24 w-24 object-contain" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            <AnimatePresence mode="wait">
              <motion.p key={loadingMsg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="text-lg font-medium text-[#8d4903]">
                {loadingMsg}
              </motion.p>
            </AnimatePresence>
            <div className="w-64 h-2 rounded-full bg-[#fbf1e8] overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #8d4903, #c4742b)" }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: loadingMessages.length * 1.2, ease: "linear" }} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── SWOT card helper ──
  const swotCards = [
    { label: "優勢", icon: Shield, text: swot.strengths, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "劣勢", icon: AlertTriangle, text: swot.weaknesses, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "機會", icon: Zap, text: swot.opportunities, color: "text-sky-700", bg: "bg-sky-50" },
    { label: "威脅", icon: ShieldAlert, text: swot.threats, color: "text-rose-700", bg: "bg-rose-50" },
  ];

  // ── Timeline items ──
  const timelineItems = [
    { label: "短期計畫", icon: Clock, text: gap_analysis?.action_plan?.short_term ?? '', accent: "#8d4903" },
    { label: "中期計畫", icon: CalendarDays, text: gap_analysis?.action_plan?.mid_term ?? '', accent: "#c4742b" },
    { label: "長期計畫", icon: CalendarRange, text: gap_analysis?.action_plan?.long_term ?? '', accent: "#dabea8" },
  ];

  // ── Main View (phase === "done") ──
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <Radar className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">職能圖譜</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">深入分析您的技能優勢與發展潛力</p>
          {/* Metadata */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <span>使用者 ID：{report_metadata.user_id}</span>
            <span>生成時間：{new Date(report_metadata.timestamp).toLocaleString("zh-TW")}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="gap-2" onClick={handleReAnalyse}>
            <RefreshCw className="h-4 w-4" /> 重新分析
          </Button>
          <Button className="gradient-primary gap-2 hidden sm:flex" onClick={handleDownloadReport}>
            <FileText className="h-4 w-4" /> 下載分析報告
          </Button>
        </div>
      </div>

      <div className="container py-8 md:py-12 space-y-16">
        {/* Section 0: Core Insight */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">核心洞察</h2>
            </div>
            <Card className="shadow-warm">
              <CardContent className="pt-6">
                <div className="p-5 rounded-xl" style={{ backgroundColor: "#FFFBF5" }}>
                  <p className="text-[#675143] leading-relaxed text-sm md:text-base">{preliminary_summary?.core_insight}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Section 1: Radar Chart (0-5 scale) */}
        <section id="radar" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-background">
                <Radar className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">職能雷達圖</h2>
            </div>
            <Card className="transition-all duration-300 hover:shadow-medium">
              <CardContent className="pt-6">
                <div className="flex flex-row items-center gap-4 md:gap-8">
                  <div ref={radarChartRef} className="h-64 sm:h-80 flex-1 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={(radar_chart?.dimensions ?? []).map((d) => ({ axis: d.axis, score: d.score }))}>
                        <PolarGrid stroke="#dabea8" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                        <RechartsRadar name="您的職能" dataKey="score" stroke="#8d4903" fill="#8d4903" fillOpacity={0.45} strokeWidth={3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-2 w-20 sm:w-32 md:w-48">
                    <img src={mascotSrc} alt={gap_analysis?.target_position?.role ?? ''} className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 object-contain" />
                    <span className="text-xs sm:text-sm font-semibold text-muted-foreground text-center">{gap_analysis?.target_position?.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Section 2: Gap Analysis */}
        <section id="gap" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">落差分析</h2>
            </div>

            {/* Current Status: Self vs Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">自評等級</p>
                  <p className="text-2xl font-bold text-foreground">{gap_analysis?.current_status?.self_assessment}</p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-medium hover:-translate-y-1 border-primary/30 shadow-warm">
                <CardContent className="pt-6">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#fbf1e8" }}>
                    <p className="text-sm text-[#675143] mb-2">實際等級</p>
                    <p className="text-2xl font-bold text-primary">{gap_analysis?.current_status?.actual_level}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cognitive Bias */}
            <Card className="shadow-warm">
              <CardContent className="pt-6">
                <div className="p-5 rounded-xl" style={{ backgroundColor: "#FFFBF5" }}>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">認知偏差分析</p>
                      <p className="text-sm text-[#675143] leading-relaxed">{gap_analysis?.current_status?.cognitive_bias}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Position + Match */}
            <Card className="transition-all duration-300 hover:shadow-medium">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">目標職位</p>
                    <p className="text-lg font-semibold">{gap_analysis?.target_position?.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">匹配度</p>
                    <p className="text-3xl font-bold text-primary">{gap_analysis?.target_position?.match_score ?? 0}%</p>
                  </div>
                </div>
                <Progress value={gap_analysis?.target_position?.match_score ?? 0} className="h-3" />
              </CardContent>
            </Card>

            {/* SWOT Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-4">SWOT 分析</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {swotCards.map((card, idx) => (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }}>
                    <Card className={`h-full border-l-4 ${card.bg}`} style={{ borderLeftColor: card.color.replace("text-", "") }}>
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <card.icon className={`h-5 w-5 ${card.color}`} />
                          <span className={`font-semibold ${card.color}`}>{card.label}</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{card.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {swot.gap && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4">
                  <Card className="border-l-4" style={{ borderLeftColor: "#8d4903" }}>
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <CircleDot className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">核心落差</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{swot.gap}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Section 3: Action Plan Timeline */}
        <section id="action-plan" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">職涯行動計畫</h2>
            </div>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8d4903] via-[#c4742b] to-[#dabea8] hidden md:block" />

              <div className="space-y-6 md:space-y-8">
                {timelineItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.12 }}
                    className="md:pl-14 relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className="hidden md:flex absolute left-2.5 top-5 h-5 w-5 rounded-full border-2 border-white items-center justify-center z-10"
                      style={{ backgroundColor: item.accent }}
                    >
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>

                    <Card className="transition-all duration-300 hover:shadow-medium hover:-translate-y-0.5">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <item.icon className="h-5 w-5" style={{ color: item.accent }} />
                          <span className="font-semibold text-foreground">{item.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 4: Bottom Action Buttons */}
        <section className="pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openSubView("learning")}
              className="w-full sm:w-auto max-w-xs px-8 py-4 rounded-xl font-semibold text-white gradient-primary shadow-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-large hover:brightness-110 flex items-center justify-center gap-3"
            >
              <BookOpen className="h-5 w-5" /> 學習資源推薦
            </button>
            <button
              onClick={() => openSubView("sideproject")}
              className="w-full sm:w-auto max-w-xs px-8 py-4 rounded-xl font-semibold text-white gradient-primary shadow-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-large hover:brightness-110 flex items-center justify-center gap-3"
            >
              <Lightbulb className="h-5 w-5" /> Side Project 推薦
            </button>
          </motion.div>
        </section>

        {/* Mobile Download */}
        <div className="sm:hidden pt-4">
          <Button className="w-full gradient-primary gap-2" onClick={handleDownloadReport}>
            <Download className="h-4 w-4" /> 下載分析報告
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Skills;
