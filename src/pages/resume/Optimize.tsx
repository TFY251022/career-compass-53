import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Edit3, Save, RotateCcw, Palette, ChevronRight, Briefcase, GraduationCap, Mail, Phone, Globe, Award, Languages, User, Star, Sparkles, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AILoadingSpinner, AnalysisSkeleton } from '@/components/loading/LoadingStates';
import { useAppState } from '@/contexts/AppContext';
import LoginRequired from '@/components/gatekeeper/LoginRequired';
import AlertModal from '@/components/modals/AlertModal';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

type Phase = 'initial' | 'analyzing' | 'suggestions' | 'templates' | 'generating' | 'result';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  certifications: string;
  portfolio: string;
  autobiography: string;
  other: string;
}

interface Suggestion {
  section: string;
  original: string;
  optimized: string;
}

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  gradient: string;
}

const colorSchemes: ColorScheme[] = [
  {
    id: 'brand-green',
    name: '品牌綠',
    primary: 'hsl(152 69% 45%)',
    secondary: 'hsl(165 60% 42%)',
    accent: 'hsl(152 76% 52%)',
    text: 'hsl(150 10% 15%)',
    background: 'hsl(152 50% 95%)',
    gradient: 'linear-gradient(135deg, hsl(152 69% 45%) 0%, hsl(165 60% 42%) 100%)',
  },
  {
    id: 'deep-blue',
    name: '深邃藍',
    primary: 'hsl(220 75% 45%)',
    secondary: 'hsl(210 70% 50%)',
    accent: 'hsl(220 85% 55%)',
    text: 'hsl(220 20% 15%)',
    background: 'hsl(220 50% 96%)',
    gradient: 'linear-gradient(135deg, hsl(220 75% 45%) 0%, hsl(210 70% 50%) 100%)',
  },
  {
    id: 'refined-gray',
    name: '洗鍊灰',
    primary: 'hsl(220 10% 40%)',
    secondary: 'hsl(220 8% 50%)',
    accent: 'hsl(220 15% 55%)',
    text: 'hsl(220 10% 15%)',
    background: 'hsl(220 10% 96%)',
    gradient: 'linear-gradient(135deg, hsl(220 10% 40%) 0%, hsl(220 8% 50%) 100%)',
  },
  {
    id: 'modern-teal',
    name: '現代青',
    primary: 'hsl(180 60% 40%)',
    secondary: 'hsl(175 55% 45%)',
    accent: 'hsl(180 70% 50%)',
    text: 'hsl(180 15% 15%)',
    background: 'hsl(180 40% 96%)',
    gradient: 'linear-gradient(135deg, hsl(180 60% 40%) 0%, hsl(175 55% 45%) 100%)',
  },
];

const mockResumeData: ResumeData = {
  name: '王小明',
  email: 'xiaoming.wang@email.com',
  phone: '0912-345-678',
  avatar: '',
  education: '國立台灣大學 資訊工程學系 碩士 (2018-2020)\n國立成功大學 資訊工程學系 學士 (2014-2018)',
  experience: '前端工程師 - ABC科技公司 (2020-至今)\n• 負責公司官網與產品頁面開發\n• 導入 React 框架提升開發效率\n\n實習工程師 - XYZ新創 (2019-2020)\n• 協助後台系統維護',
  skills: 'React, TypeScript, Node.js, Python, Git, SQL',
  languages: '中文 (精通), 英文 (中等), 台語 (入門)',
  certifications: 'AWS Certified Developer, Google Analytics 認證',
  portfolio: 'https://portfolio.example.com',
  autobiography: '我是一名前端工程師，具備 5 年軟體開發經驗。熱愛學習新技術，善於團隊合作。',
  other: '可配合加班、可接受外派'
};

const mockSuggestions: Suggestion[] = [
  { 
    section: '工作經歷', 
    original: '負責公司官網與產品頁面開發', 
    optimized: '主導 5+ 個企業級 Web 應用開發專案，優化頁面載入速度達 40%，提升使用者留存率 25%' 
  },
  { 
    section: '技能描述', 
    original: 'React, TypeScript, Node.js', 
    optimized: '精通 React 生態系統 (Redux, React Query, Next.js)，具備 3 年 TypeScript 實戰經驗，熟悉 Node.js 後端開發' 
  },
  { 
    section: '自我介紹', 
    original: '我是一名前端工程師', 
    optimized: '具備 5 年經驗的全端工程師，專注於打造高效能、可擴展的現代 Web 應用，曾帶領 3 人團隊完成多項關鍵專案' 
  },
];

const templates = [
  {
    id: 'corporate',
    name: '經典專業型',
    subtitle: 'The Corporate Classic',
    description: '強調邏輯性與權威感，適合金融、法律、管理顧問或大型企業',
    features: ['單欄式佈局', '襯線體設計', 'ATS 友善度最高'],
    icon: Briefcase,
  },
  {
    id: 'modern',
    name: '現代極簡型',
    subtitle: 'Modern Minimalist',
    description: '清晰的資訊層級，適合軟體工程、科技產業或新創公司',
    features: ['雙欄式 (3:7)', '技能進度條', '大量留白設計'],
    icon: Star,
  },
  {
    id: 'creative',
    name: '創意視覺型',
    subtitle: 'Creative Portfolio',
    description: '個人品牌展現，專為設計、行銷、公關或媒體從業者設計',
    features: ['非對稱設計', '莫蘭迪色系', '卡片式作品集'],
    icon: Sparkles,
  },
];

const Optimize = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isResumeUploaded, isPersonalityQuizDone } = useAppState();
  const [phase, setPhase] = useState<Phase>('initial');
  const [resumeData, setResumeData] = useState<ResumeData>(mockResumeData);
  const [editedData, setEditedData] = useState<ResumeData>(mockResumeData);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>('brand-green');
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showAccessAlert, setShowAccessAlert] = useState(false);
  const [accessAlertMessage, setAccessAlertMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Check access conditions
  useEffect(() => {
    if (isLoggedIn) {
      if (!isResumeUploaded) {
        setAccessAlertMessage('請先上傳您的履歷資料');
        setShowAccessAlert(true);
      } else if (!isPersonalityQuizDone) {
        setAccessAlertMessage('請先完成性格測驗');
        setShowAccessAlert(true);
      }
    }
  }, [isLoggedIn, isResumeUploaded, isPersonalityQuizDone]);

  const handleAccessAlertClose = () => {
    setShowAccessAlert(false);
    navigate(-1);
  };

  const handleStartOptimize = async () => {
    setPhase('analyzing');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSuggestions(mockSuggestions);
    setPhase('suggestions');
  };

  const handleSelectTemplate = async (templateId: string, colorScheme: string) => {
    setSelectedTemplate(templateId);
    setSelectedColorScheme(colorScheme);
    setPhase('generating');
    await new Promise(resolve => setTimeout(resolve, 2500));
    setPhase('result');
  };

  const handleDownloadSuggestions = () => {
    const content = suggestions.map(s => 
      `【${s.section}】\n原始：${s.original}\n優化：${s.optimized}\n`
    ).join('\n');
    downloadTextFile(content, '履歷優化建議.txt');
  };

  const handleDownloadResume = async () => {
    if (!resumeRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const element = resumeRef.current;
      const colorScheme = colorSchemes.find(c => c.id === selectedColorScheme) || colorSchemes[0];
      
      // Create a clone for PDF generation
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = '210mm';
      clone.style.padding = '15mm';
      clone.style.backgroundColor = '#ffffff';
      
      // Apply page break styles
      const sections = clone.querySelectorAll('[data-pdf-section]');
      sections.forEach((section) => {
        (section as HTMLElement).style.pageBreakInside = 'avoid';
        (section as HTMLElement).style.breakInside = 'avoid';
      });

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `優化履歷_${selectedTemplate}_${colorScheme.name}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const,
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['[data-pdf-section]', '.avoid-break'],
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = () => {
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    setResumeData(editedData);
    setIsEditing(false);
    setShowSaveConfirm(false);
  };

  const handleReset = () => {
    setPhase('initial');
    setSelectedTemplate('');
    setSelectedColorScheme('brand-green');
    setIsEditing(false);
    setEditedData(mockResumeData);
  };

  const handleBackToTemplates = () => {
    setPhase('templates');
    setSelectedTemplate('');
  };

  // Access guard check
  const hasAccess = isResumeUploaded && isPersonalityQuizDone;

  return (
    <LoginRequired>
      <div className="container py-12 animate-fade-in">
        {/* Access Alert */}
        <AlertModal
          open={showAccessAlert}
          onClose={handleAccessAlertClose}
          type="warning"
          title="需要完成前置步驟"
          message={accessAlertMessage}
          confirmLabel="返回"
        />

        {/* Save Confirmation */}
        <AlertModal
          open={showSaveConfirm}
          onClose={() => setShowSaveConfirm(false)}
          type="info"
          title="確認儲存變更"
          message="確定要儲存您編輯的履歷內容嗎？"
          confirmLabel="確認儲存"
          cancelLabel="取消"
          showCancel
          onConfirm={confirmSave}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">履歷優化</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI 智能分析您的履歷，提供專業優化建議並生成精美履歷
          </p>
        </div>

        {!hasAccess && isLoggedIn ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">尚未完成前置步驟</h3>
              <p className="text-muted-foreground mb-6">
                請先上傳履歷並完成性格測驗，才能使用履歷優化功能
              </p>
              <Button className="gradient-primary" onClick={() => navigate('/member/upload-resume')}>
                前往上傳履歷
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Phase: Initial - Show Original Resume */}
              {phase === 'initial' && (
                <InitialPhase
                  resumeData={resumeData}
                  onStartOptimize={handleStartOptimize}
                />
              )}

              {/* Phase: Analyzing */}
              {phase === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AILoadingSpinner message="正在分析履歷，生成優化建議..." />
                  <AnalysisSkeleton />
                </motion.div>
              )}

              {/* Phase: Suggestions */}
              {phase === 'suggestions' && (
                <SuggestionsPhase
                  suggestions={suggestions}
                  onDownload={handleDownloadSuggestions}
                  onGenerate={() => setPhase('templates')}
                />
              )}

              {/* Phase: Template Selection */}
              {phase === 'templates' && (
                <TemplateSelectionPhase
                  onSelect={handleSelectTemplate}
                  onBack={() => setPhase('suggestions')}
                />
              )}

              {/* Phase: Generating */}
              {phase === 'generating' && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AILoadingSpinner message="正在生成優化履歷中..." />
                  <AnalysisSkeleton />
                </motion.div>
              )}

              {/* Phase: Result */}
              {phase === 'result' && (
                <ResultPhase
                  resumeData={isEditing ? editedData : resumeData}
                  selectedTemplate={selectedTemplate}
                  selectedColorScheme={selectedColorScheme}
                  isEditing={isEditing}
                  isDownloading={isDownloading}
                  resumeRef={resumeRef}
                  onEdit={() => {
                    setEditedData(resumeData);
                    setIsEditing(true);
                  }}
                  onSave={handleSaveEdit}
                  onCancelEdit={() => setIsEditing(false)}
                  onDataChange={setEditedData}
                  onDownload={handleDownloadResume}
                  onBackToTemplates={handleBackToTemplates}
                  onReset={handleReset}
                  onColorChange={setSelectedColorScheme}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </LoginRequired>
  );
};

// Color Scheme Selector Component
const ColorSchemeSelector = ({
  selectedScheme,
  onChange,
  compact = false,
}: {
  selectedScheme: string;
  onChange: (schemeId: string) => void;
  compact?: boolean;
}) => (
  <div className={`flex ${compact ? 'gap-2' : 'gap-3'}`}>
    {colorSchemes.map((scheme) => (
      <button
        key={scheme.id}
        onClick={() => onChange(scheme.id)}
        className={`group relative transition-all duration-200 ${
          compact ? 'h-6 w-6' : 'h-8 w-8'
        } rounded-full border-2 ${
          selectedScheme === scheme.id
            ? 'border-foreground scale-110 shadow-md'
            : 'border-transparent hover:scale-105'
        }`}
        style={{ background: scheme.gradient }}
        title={scheme.name}
      >
        {selectedScheme === scheme.id && (
          <Check className={`absolute inset-0 m-auto ${compact ? 'h-3 w-3' : 'h-4 w-4'} text-white drop-shadow-md`} />
        )}
        {!compact && (
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {scheme.name}
          </span>
        )}
      </button>
    ))}
  </div>
);

// Initial Phase Component
const InitialPhase = ({ 
  resumeData, 
  onStartOptimize 
}: { 
  resumeData: ResumeData; 
  onStartOptimize: () => void;
}) => (
  <motion.div
    key="initial"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          您的履歷資料
        </CardTitle>
        <CardDescription>以下是您目前的履歷內容，點擊開始優化進行 AI 分析</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            {resumeData.avatar ? (
              <img src={resumeData.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold">{resumeData.name}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {resumeData.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {resumeData.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Resume Fields */}
        <div className="grid gap-4">
          <ResumeField icon={GraduationCap} label="教育背景" value={resumeData.education} />
          <ResumeField icon={Briefcase} label="工作經歷" value={resumeData.experience} />
          <ResumeField icon={Star} label="技能專長" value={resumeData.skills} />
          <ResumeField icon={Languages} label="語言能力" value={resumeData.languages} />
          <ResumeField icon={Award} label="證照成就" value={resumeData.certifications} />
          <ResumeField icon={Globe} label="作品集" value={resumeData.portfolio} />
          <ResumeField icon={FileText} label="自傳" value={resumeData.autobiography} />
        </div>
      </CardContent>
    </Card>

    <div className="flex justify-center">
      <Button size="lg" className="gradient-primary gap-2" onClick={onStartOptimize}>
        <Sparkles className="h-5 w-5" />
        開始優化
      </Button>
    </div>
  </motion.div>
);

// Resume Field Display Component
const ResumeField = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string;
}) => (
  <div className="p-4 bg-muted/30 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium text-sm">{label}</span>
    </div>
    <p className="text-sm whitespace-pre-line">{value}</p>
  </div>
);

// Suggestions Phase Component
const SuggestionsPhase = ({ 
  suggestions, 
  onDownload, 
  onGenerate 
}: { 
  suggestions: Suggestion[]; 
  onDownload: () => void; 
  onGenerate: () => void;
}) => (
  <motion.div
    key="suggestions"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          履歷優化建議
        </CardTitle>
        <CardDescription>AI 已分析您的履歷，以下是專業優化建議</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-primary flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              {s.section}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-transparent">
                <p className="text-xs text-muted-foreground mb-2">原始內容</p>
                <p className="text-sm">{s.original}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-primary mb-2">優化建議</p>
                <p className="text-sm">{s.optimized}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>

    <div className="flex gap-4">
      <Button variant="outline" className="flex-1 gap-2" onClick={onDownload}>
        <Download className="h-4 w-4" />
        下載建議報告
      </Button>
      <Button className="flex-1 gradient-primary gap-2" onClick={onGenerate}>
        <Palette className="h-4 w-4" />
        生成優化履歷
      </Button>
    </div>
  </motion.div>
);

// Template Selection Phase Component with Color Scheme
const TemplateSelectionPhase = ({ 
  onSelect, 
  onBack 
}: { 
  onSelect: (id: string, colorScheme: string) => void; 
  onBack: () => void;
}) => {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    corporate: 'brand-green',
    modern: 'brand-green',
    creative: 'brand-green',
  });

  return (
    <motion.div
      key="templates"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">選擇履歷樣板</h2>
        <p className="text-muted-foreground">根據您的職業目標選擇最適合的履歷風格與配色</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template, i) => {
          const selectedScheme = colorSchemes.find(c => c.id === selectedColors[template.id]) || colorSchemes[0];
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <div 
                  className="h-32 flex items-center justify-center transition-all duration-300"
                  style={{ background: selectedScheme.gradient }}
                >
                  <template.icon className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-xs">{template.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <ul className="space-y-1">
                    {template.features.map((feature, j) => (
                      <li key={j} className="text-xs flex items-center gap-2">
                        <Check className="h-3 w-3" style={{ color: selectedScheme.primary }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Color Scheme Selector */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">選擇配色</p>
                    <ColorSchemeSelector
                      selectedScheme={selectedColors[template.id]}
                      onChange={(schemeId) => setSelectedColors(prev => ({ ...prev, [template.id]: schemeId }))}
                      compact
                    />
                  </div>
                  
                  <Button 
                    className="w-full gap-2"
                    style={{ 
                      background: selectedScheme.gradient,
                      color: 'white',
                    }}
                    onClick={() => onSelect(template.id, selectedColors[template.id])}
                  >
                    選擇此樣板
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          返回建議頁面
        </Button>
      </div>
    </motion.div>
  );
};

// Result Phase Component
const ResultPhase = ({
  resumeData,
  selectedTemplate,
  selectedColorScheme,
  isEditing,
  isDownloading,
  resumeRef,
  onEdit,
  onSave,
  onCancelEdit,
  onDataChange,
  onDownload,
  onBackToTemplates,
  onReset,
  onColorChange,
}: {
  resumeData: ResumeData;
  selectedTemplate: string;
  selectedColorScheme: string;
  isEditing: boolean;
  isDownloading: boolean;
  resumeRef: React.RefObject<HTMLDivElement>;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDataChange: (data: ResumeData) => void;
  onDownload: () => void;
  onBackToTemplates: () => void;
  onReset: () => void;
  onColorChange: (schemeId: string) => void;
}) => {
  const template = templates.find(t => t.id === selectedTemplate);
  const colorScheme = colorSchemes.find(c => c.id === selectedColorScheme) || colorSchemes[0];
  
  const handleFieldChange = (field: keyof ResumeData, value: string) => {
    onDataChange({ ...resumeData, [field]: value });
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Template Badge & Color Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ background: colorScheme.gradient }}
          >
            {template && <template.icon className="h-5 w-5 text-white" />}
          </div>
          <div>
            <p className="font-medium">{template?.name}</p>
            <p className="text-xs text-muted-foreground">{template?.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Color scheme selector in result view */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">配色：</span>
            <ColorSchemeSelector
              selectedScheme={selectedColorScheme}
              onChange={onColorChange}
              compact
            />
          </div>
          
          {!isEditing && (
            <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
              <Edit3 className="h-4 w-4" />
              編輯
            </Button>
          )}
        </div>
      </div>

      {/* Resume Preview with PDF ref */}
      <Card className={isEditing ? 'ring-2 ring-primary/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : ''}>
        <CardContent className="p-6">
          <div ref={resumeRef} className="pdf-container bg-white text-foreground">
            {selectedTemplate === 'corporate' && (
              <CorporateTemplate 
                data={resumeData} 
                isEditing={isEditing} 
                onChange={handleFieldChange}
                colorScheme={colorScheme}
              />
            )}
            {selectedTemplate === 'modern' && (
              <ModernTemplate 
                data={resumeData} 
                isEditing={isEditing} 
                onChange={handleFieldChange}
                colorScheme={colorScheme}
              />
            )}
            {selectedTemplate === 'creative' && (
              <CreativeTemplate 
                data={resumeData} 
                isEditing={isEditing} 
                onChange={handleFieldChange}
                colorScheme={colorScheme}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing ? (
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={onCancelEdit}>
            取消
          </Button>
          <Button className="flex-1 gradient-primary gap-2" onClick={onSave}>
            <Save className="h-4 w-4" />
            儲存
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="gap-2" onClick={onBackToTemplates}>
            <Palette className="h-4 w-4" />
            重新選擇樣板
          </Button>
          <Button variant="outline" className="gap-2" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            重新填寫
          </Button>
          <Button 
            className="flex-1 gap-2" 
            style={{ background: colorScheme.gradient, color: 'white' }}
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? '生成中...' : '下載履歷'}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// Editable Field Component
const EditableField = ({
  value,
  onChange,
  isEditing,
  multiline = false,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  multiline?: boolean;
  className?: string;
}) => {
  if (!isEditing) {
    return <span className={`whitespace-pre-line ${className}`}>{value}</span>;
  }

  const editClass = 'ring-1 ring-primary/30 shadow-[0_0_8px_rgba(34,197,94,0.2)] transition-shadow';

  if (multiline) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${editClass} ${className}`}
        rows={4}
      />
    );
  }

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${editClass} ${className}`}
    />
  );
};

// Corporate Template with Dynamic Colors
const CorporateTemplate = ({
  data,
  isEditing,
  onChange,
  colorScheme,
}: {
  data: ResumeData;
  isEditing: boolean;
  onChange: (field: keyof ResumeData, value: string) => void;
  colorScheme: ColorScheme;
}) => (
  <div className="font-serif space-y-6" style={{ color: colorScheme.text }}>
    {/* Header */}
    <div 
      className="text-center pb-4 avoid-break" 
      data-pdf-section
      style={{ borderBottom: `2px solid ${colorScheme.primary}` }}
    >
      <h1 className="text-3xl font-bold tracking-wide" style={{ color: colorScheme.primary }}>
        <EditableField value={data.name} onChange={(v) => onChange('name', v)} isEditing={isEditing} />
      </h1>
      <div className="flex justify-center gap-6 mt-2 text-sm" style={{ color: colorScheme.secondary }}>
        <EditableField value={data.email} onChange={(v) => onChange('email', v)} isEditing={isEditing} />
        <span>|</span>
        <EditableField value={data.phone} onChange={(v) => onChange('phone', v)} isEditing={isEditing} />
      </div>
    </div>

    {/* Sections with page break control */}
    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="教育背景" colorScheme={colorScheme}>
        <EditableField value={data.education} onChange={(v) => onChange('education', v)} isEditing={isEditing} multiline />
      </TemplateSectionWithColor>
    </div>

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="工作經歷" colorScheme={colorScheme}>
        <EditableField value={data.experience} onChange={(v) => onChange('experience', v)} isEditing={isEditing} multiline />
      </TemplateSectionWithColor>
    </div>

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="技能專長" colorScheme={colorScheme}>
        <EditableField value={data.skills} onChange={(v) => onChange('skills', v)} isEditing={isEditing} />
      </TemplateSectionWithColor>
    </div>

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="語言能力" colorScheme={colorScheme}>
        <EditableField value={data.languages} onChange={(v) => onChange('languages', v)} isEditing={isEditing} />
      </TemplateSectionWithColor>
    </div>

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="證照與成就" colorScheme={colorScheme}>
        <EditableField value={data.certifications} onChange={(v) => onChange('certifications', v)} isEditing={isEditing} />
      </TemplateSectionWithColor>
    </div>
  </div>
);

// Modern Template with Dynamic Colors
const ModernTemplate = ({
  data,
  isEditing,
  onChange,
  colorScheme,
}: {
  data: ResumeData;
  isEditing: boolean;
  onChange: (field: keyof ResumeData, value: string) => void;
  colorScheme: ColorScheme;
}) => {
  const skills = data.skills.split(',').map(s => s.trim());
  
  return (
    <div className="grid md:grid-cols-[1fr_2.5fr] gap-6">
      {/* Left Sidebar */}
      <div 
        className="space-y-6 p-4 rounded-lg avoid-break" 
        data-pdf-section
        style={{ backgroundColor: colorScheme.background }}
      >
        {/* Avatar */}
        <div 
          className="h-32 w-32 mx-auto rounded-full flex items-center justify-center"
          style={{ background: colorScheme.gradient }}
        >
          <span className="text-4xl font-bold text-white">{data.name.charAt(0)}</span>
        </div>

        {/* Contact */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" style={{ color: colorScheme.primary }} />
            <EditableField value={data.email} onChange={(v) => onChange('email', v)} isEditing={isEditing} className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" style={{ color: colorScheme.primary }} />
            <EditableField value={data.phone} onChange={(v) => onChange('phone', v)} isEditing={isEditing} className="text-xs" />
          </div>
        </div>

        {/* Skills with Progress Bars */}
        <div className="space-y-3">
          <h3 
            className="font-semibold text-sm pb-1"
            style={{ borderBottom: `1px solid ${colorScheme.primary}30` }}
          >
            技能專長
          </h3>
          {isEditing ? (
            <EditableField value={data.skills} onChange={(v) => onChange('skills', v)} isEditing={isEditing} multiline />
          ) : (
            <div className="space-y-2">
              {skills.slice(0, 5).map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill}</span>
                    <span>{90 - i * 10}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${90 - i * 10}%`,
                        background: colorScheme.gradient,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <h3 
            className="font-semibold text-sm pb-1"
            style={{ borderBottom: `1px solid ${colorScheme.primary}30` }}
          >
            語言能力
          </h3>
          <EditableField value={data.languages} onChange={(v) => onChange('languages', v)} isEditing={isEditing} className="text-xs" />
        </div>
      </div>

      {/* Right Content */}
      <div className="space-y-6">
        <div data-pdf-section className="avoid-break">
          <h1 className="text-3xl font-bold" style={{ color: colorScheme.primary }}>
            <EditableField value={data.name} onChange={(v) => onChange('name', v)} isEditing={isEditing} />
          </h1>
          <p className="text-muted-foreground mt-1">
            <EditableField value={data.autobiography} onChange={(v) => onChange('autobiography', v)} isEditing={isEditing} multiline />
          </p>
        </div>

        <div className="space-y-4" data-pdf-section>
          <h3 
            className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
            style={{ borderBottom: `1px solid ${colorScheme.primary}30` }}
          >
            <Briefcase className="h-4 w-4" style={{ color: colorScheme.primary }} />
            工作經歷
          </h3>
          <EditableField value={data.experience} onChange={(v) => onChange('experience', v)} isEditing={isEditing} multiline className="text-sm" />
        </div>

        <div className="space-y-4" data-pdf-section>
          <h3 
            className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
            style={{ borderBottom: `1px solid ${colorScheme.primary}30` }}
          >
            <GraduationCap className="h-4 w-4" style={{ color: colorScheme.primary }} />
            教育背景
          </h3>
          <EditableField value={data.education} onChange={(v) => onChange('education', v)} isEditing={isEditing} multiline className="text-sm" />
        </div>

        <div className="space-y-4" data-pdf-section>
          <h3 
            className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
            style={{ borderBottom: `1px solid ${colorScheme.primary}30` }}
          >
            <Award className="h-4 w-4" style={{ color: colorScheme.primary }} />
            證照與成就
          </h3>
          <EditableField value={data.certifications} onChange={(v) => onChange('certifications', v)} isEditing={isEditing} className="text-sm" />
        </div>
      </div>
    </div>
  );
};

// Creative Template with Dynamic Colors
const CreativeTemplate = ({
  data,
  isEditing,
  onChange,
  colorScheme,
}: {
  data: ResumeData;
  isEditing: boolean;
  onChange: (field: keyof ResumeData, value: string) => void;
  colorScheme: ColorScheme;
}) => (
  <div className="relative">
    {/* Decorative Background */}
    <div 
      className="absolute inset-0 rounded-lg opacity-20" 
      style={{ background: colorScheme.gradient }}
    />
    
    <div className="relative p-6 space-y-6">
      {/* Header with asymmetric design */}
      <div className="flex flex-col md:flex-row items-center gap-6 avoid-break" data-pdf-section>
        {/* Avatar with decorative frame */}
        <div className="relative">
          <div 
            className="h-36 w-36 rounded-full p-1"
            style={{ background: colorScheme.gradient }}
          >
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
              <span 
                className="text-5xl font-bold"
                style={{ 
                  background: colorScheme.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {data.name.charAt(0)}
              </span>
            </div>
          </div>
          <div 
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center"
            style={{ background: colorScheme.gradient }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 
            className="text-4xl font-bold"
            style={{ 
              background: colorScheme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <EditableField value={data.name} onChange={(v) => onChange('name', v)} isEditing={isEditing} />
          </h1>
          <p className="mt-2 text-muted-foreground">
            <EditableField value={data.autobiography} onChange={(v) => onChange('autobiography', v)} isEditing={isEditing} multiline />
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1" style={{ color: colorScheme.primary }}>
              <Mail className="h-4 w-4" />
              <EditableField value={data.email} onChange={(v) => onChange('email', v)} isEditing={isEditing} />
            </span>
            <span className="flex items-center gap-1" style={{ color: colorScheme.secondary }}>
              <Phone className="h-4 w-4" />
              <EditableField value={data.phone} onChange={(v) => onChange('phone', v)} isEditing={isEditing} />
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div data-pdf-section className="avoid-break">
          <CreativeSectionWithColor title="工作經歷" colorScheme={colorScheme}>
            <EditableField value={data.experience} onChange={(v) => onChange('experience', v)} isEditing={isEditing} multiline />
          </CreativeSectionWithColor>
        </div>

        <div data-pdf-section className="avoid-break">
          <CreativeSectionWithColor title="教育背景" colorScheme={colorScheme} useSecondary>
            <EditableField value={data.education} onChange={(v) => onChange('education', v)} isEditing={isEditing} multiline />
          </CreativeSectionWithColor>
        </div>
      </div>

      {/* Skills as Pills */}
      <div data-pdf-section className="avoid-break">
        <CreativeSectionWithColor title="技能專長" colorScheme={colorScheme} fullWidth>
          {isEditing ? (
            <EditableField value={data.skills} onChange={(v) => onChange('skills', v)} isEditing={isEditing} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.split(',').map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${colorScheme.primary}15`,
                    color: colorScheme.primary,
                  }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}
        </CreativeSectionWithColor>
      </div>

      {/* Portfolio as Cards */}
      <div data-pdf-section className="avoid-break">
        <CreativeSectionWithColor title="作品集" colorScheme={colorScheme} fullWidth useSecondary>
          {isEditing ? (
            <EditableField value={data.portfolio} onChange={(v) => onChange('portfolio', v)} isEditing={isEditing} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div 
                    className="h-24"
                    style={{ background: colorScheme.gradient }}
                  />
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">專案作品 {i}</p>
                    <p className="text-xs text-muted-foreground">掃描 QR Code 查看</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CreativeSectionWithColor>
      </div>
    </div>
  </div>
);

// Template Section Helper with Color
const TemplateSectionWithColor = ({ 
  title, 
  children,
  colorScheme,
}: { 
  title: string; 
  children: React.ReactNode;
  colorScheme: ColorScheme;
}) => (
  <div>
    <h2 
      className="text-lg font-bold pb-1 mb-3"
      style={{ 
        color: colorScheme.primary,
        borderBottom: `1px solid ${colorScheme.primary}40`,
      }}
    >
      {title}
    </h2>
    <div className="text-sm">{children}</div>
  </div>
);

// Creative Section Helper with Color
const CreativeSectionWithColor = ({ 
  title, 
  children, 
  colorScheme,
  useSecondary = false,
  fullWidth = false,
}: { 
  title: string; 
  children: React.ReactNode; 
  colorScheme: ColorScheme;
  useSecondary?: boolean;
  fullWidth?: boolean;
}) => (
  <div 
    className={`p-4 rounded-lg bg-white/50 dark:bg-white/5 ${fullWidth ? 'col-span-full' : ''}`}
    style={{ borderLeft: `4px solid ${useSecondary ? colorScheme.secondary : colorScheme.primary}` }}
  >
    <h3 
      className="font-semibold mb-3"
      style={{ color: useSecondary ? colorScheme.secondary : colorScheme.primary }}
    >
      {title}
    </h3>
    <div className="text-sm">{children}</div>
  </div>
);

export default Optimize;
