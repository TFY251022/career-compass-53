import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Edit3, Save, RotateCcw, Palette, ChevronRight, Briefcase, GraduationCap, Mail, Phone, Globe, Award, Languages, User, Star, Sparkles, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AILoadingSpinner, ContentTransition, AnalysisSkeleton } from '@/components/loading/LoadingStates';
import { useAppState } from '@/contexts/AppContext';
import LoginRequired from '@/components/gatekeeper/LoginRequired';
import AlertModal from '@/components/modals/AlertModal';
import { motion, AnimatePresence } from 'framer-motion';

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
    color: 'from-slate-600 to-slate-800',
    icon: Briefcase,
  },
  {
    id: 'modern',
    name: '現代極簡型',
    subtitle: 'Modern Minimalist',
    description: '清晰的資訊層級，適合軟體工程、科技產業或新創公司',
    features: ['雙欄式 (3:7)', '技能進度條', '大量留白設計'],
    color: 'from-primary to-emerald-600',
    icon: Star,
  },
  {
    id: 'creative',
    name: '創意視覺型',
    subtitle: 'Creative Portfolio',
    description: '個人品牌展現，專為設計、行銷、公關或媒體從業者設計',
    features: ['非對稱設計', '莫蘭迪色系', '卡片式作品集'],
    color: 'from-purple-500 to-pink-500',
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
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showAccessAlert, setShowAccessAlert] = useState(false);
  const [accessAlertMessage, setAccessAlertMessage] = useState('');

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

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setPhase('generating');
    await new Promise(resolve => setTimeout(resolve, 2500));
    setPhase('result');
  };

  const handleDownloadSuggestions = () => {
    const content = suggestions.map(s => 
      `【${s.section}】\n原始：${s.original}\n優化：${s.optimized}\n`
    ).join('\n');
    downloadFile(content, '履歷優化建議.txt');
  };

  const handleDownloadResume = () => {
    const content = Object.entries(editedData)
      .filter(([key]) => key !== 'avatar')
      .map(([key, value]) => `【${getFieldLabel(key)}】\n${value}`)
      .join('\n\n');
    downloadFile(content, `優化履歷_${selectedTemplate}.txt`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      name: '姓名',
      email: '聯絡信箱',
      phone: '聯絡電話',
      education: '教育背景',
      experience: '工作經歷',
      skills: '技能專長',
      languages: '語言能力',
      certifications: '證照成就',
      portfolio: '作品集',
      autobiography: '自傳',
      other: '其他',
    };
    return labels[key] || key;
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
                  isEditing={isEditing}
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
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </LoginRequired>
  );
};

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

// Template Selection Phase Component
const TemplateSelectionPhase = ({ 
  onSelect, 
  onBack 
}: { 
  onSelect: (id: string) => void; 
  onBack: () => void;
}) => (
  <motion.div
    key="templates"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-2">選擇履歷樣板</h2>
      <p className="text-muted-foreground">根據您的職業目標選擇最適合的履歷風格</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {templates.map((template, i) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group overflow-hidden"
            onClick={() => onSelect(template.id)}
          >
            <div className={`h-32 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
              <template.icon className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-xs">{template.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <ul className="space-y-1">
                {template.features.map((feature, j) => (
                  <li key={j} className="text-xs flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    <div className="flex justify-center">
      <Button variant="outline" onClick={onBack}>
        返回建議頁面
      </Button>
    </div>
  </motion.div>
);

// Result Phase Component
const ResultPhase = ({
  resumeData,
  selectedTemplate,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onDataChange,
  onDownload,
  onBackToTemplates,
  onReset,
}: {
  resumeData: ResumeData;
  selectedTemplate: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDataChange: (data: ResumeData) => void;
  onDownload: () => void;
  onBackToTemplates: () => void;
  onReset: () => void;
}) => {
  const template = templates.find(t => t.id === selectedTemplate);
  
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
      {/* Template Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${template?.color} flex items-center justify-center`}>
            {template && <template.icon className="h-5 w-5 text-white" />}
          </div>
          <div>
            <p className="font-medium">{template?.name}</p>
            <p className="text-xs text-muted-foreground">{template?.subtitle}</p>
          </div>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
            <Edit3 className="h-4 w-4" />
            編輯
          </Button>
        )}
      </div>

      {/* Resume Preview */}
      <Card className={isEditing ? 'ring-2 ring-primary/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : ''}>
        <CardContent className="p-6">
          {selectedTemplate === 'corporate' && (
            <CorporateTemplate data={resumeData} isEditing={isEditing} onChange={handleFieldChange} />
          )}
          {selectedTemplate === 'modern' && (
            <ModernTemplate data={resumeData} isEditing={isEditing} onChange={handleFieldChange} />
          )}
          {selectedTemplate === 'creative' && (
            <CreativeTemplate data={resumeData} isEditing={isEditing} onChange={handleFieldChange} />
          )}
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
          <Button className="flex-1 gradient-primary gap-2" onClick={onDownload}>
            <Download className="h-4 w-4" />
            下載履歷
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

// Corporate Template
const CorporateTemplate = ({
  data,
  isEditing,
  onChange,
}: {
  data: ResumeData;
  isEditing: boolean;
  onChange: (field: keyof ResumeData, value: string) => void;
}) => (
  <div className="font-serif space-y-6">
    {/* Header */}
    <div className="text-center border-b-2 border-slate-800 pb-4">
      <h1 className="text-3xl font-bold text-slate-800 tracking-wide">
        <EditableField value={data.name} onChange={(v) => onChange('name', v)} isEditing={isEditing} />
      </h1>
      <div className="flex justify-center gap-6 mt-2 text-sm text-slate-600">
        <EditableField value={data.email} onChange={(v) => onChange('email', v)} isEditing={isEditing} />
        <span>|</span>
        <EditableField value={data.phone} onChange={(v) => onChange('phone', v)} isEditing={isEditing} />
      </div>
    </div>

    {/* Sections */}
    <TemplateSection title="教育背景" isEditing={isEditing}>
      <EditableField value={data.education} onChange={(v) => onChange('education', v)} isEditing={isEditing} multiline />
    </TemplateSection>

    <TemplateSection title="工作經歷" isEditing={isEditing}>
      <EditableField value={data.experience} onChange={(v) => onChange('experience', v)} isEditing={isEditing} multiline />
    </TemplateSection>

    <TemplateSection title="技能專長" isEditing={isEditing}>
      <EditableField value={data.skills} onChange={(v) => onChange('skills', v)} isEditing={isEditing} />
    </TemplateSection>

    <TemplateSection title="語言能力" isEditing={isEditing}>
      <EditableField value={data.languages} onChange={(v) => onChange('languages', v)} isEditing={isEditing} />
    </TemplateSection>

    <TemplateSection title="證照與成就" isEditing={isEditing}>
      <EditableField value={data.certifications} onChange={(v) => onChange('certifications', v)} isEditing={isEditing} />
    </TemplateSection>
  </div>
);

// Modern Template
const ModernTemplate = ({
  data,
  isEditing,
  onChange,
}: {
  data: ResumeData;
  isEditing: boolean;
  onChange: (field: keyof ResumeData, value: string) => void;
}) => {
  const skills = data.skills.split(',').map(s => s.trim());
  
  return (
    <div className="grid md:grid-cols-[1fr_2.5fr] gap-6">
      {/* Left Sidebar */}
      <div className="space-y-6 bg-muted/30 p-4 rounded-lg">
        {/* Avatar */}
        <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{data.name.charAt(0)}</span>
        </div>

        {/* Contact */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <EditableField value={data.email} onChange={(v) => onChange('email', v)} isEditing={isEditing} className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <EditableField value={data.phone} onChange={(v) => onChange('phone', v)} isEditing={isEditing} className="text-xs" />
          </div>
        </div>

        {/* Skills with Progress Bars */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm border-b border-primary/30 pb-1">技能專長</h3>
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
                  <Progress value={90 - i * 10} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm border-b border-primary/30 pb-1">語言能力</h3>
          <EditableField value={data.languages} onChange={(v) => onChange('languages', v)} isEditing={isEditing} className="text-xs" />
        </div>
      </div>

      {/* Right Content */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            <EditableField value={data.name} onChange={(v) => onChange('name', v)} isEditing={isEditing} />
          </h1>
          <p className="text-muted-foreground mt-1">
            <EditableField value={data.autobiography} onChange={(v) => onChange('autobiography', v)} isEditing={isEditing} multiline />
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b border-primary/30 pb-1 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            工作經歷
          </h3>
          <EditableField value={data.experience} onChange={(v) => onChange('experience', v)} isEditing={isEditing} multiline className="text-sm" />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b border-primary/30 pb-1 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            教育背景
          </h3>
          <EditableField value={data.education} onChange={(v) => onChange('education', v)} isEditing={isEditing} multiline className="text-sm" />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b border-primary/30 pb-1 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            證照與成就
          </h3>
          <EditableField value={data.certifications} onChange={(v) => onChange('certifications', v)} isEditing={isEditing} className="text-sm" />
        </div>
      </div>
    </div>
  );
};

// Creative Template
const CreativeTemplate = ({
  data,
  isEditing,
  onChange,
}: {
  data: ResumeData;
  isEditing: boolean;
  onChange: (field: keyof ResumeData, value: string) => void;
}) => (
  <div className="relative">
    {/* Decorative Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg" />
    
    <div className="relative p-6 space-y-6">
      {/* Header with asymmetric design */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar with decorative frame */}
        <div className="relative">
          <div className="h-36 w-36 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
              <span className="text-5xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {data.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <EditableField value={data.name} onChange={(v) => onChange('name', v)} isEditing={isEditing} />
          </h1>
          <p className="mt-2 text-muted-foreground">
            <EditableField value={data.autobiography} onChange={(v) => onChange('autobiography', v)} isEditing={isEditing} multiline />
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-purple-600">
              <Mail className="h-4 w-4" />
              <EditableField value={data.email} onChange={(v) => onChange('email', v)} isEditing={isEditing} />
            </span>
            <span className="flex items-center gap-1 text-pink-600">
              <Phone className="h-4 w-4" />
              <EditableField value={data.phone} onChange={(v) => onChange('phone', v)} isEditing={isEditing} />
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <CreativeSection title="工作經歷" color="purple">
          <EditableField value={data.experience} onChange={(v) => onChange('experience', v)} isEditing={isEditing} multiline />
        </CreativeSection>

        <CreativeSection title="教育背景" color="pink">
          <EditableField value={data.education} onChange={(v) => onChange('education', v)} isEditing={isEditing} multiline />
        </CreativeSection>
      </div>

      {/* Skills as Pills */}
      <CreativeSection title="技能專長" color="purple" fullWidth>
        {isEditing ? (
          <EditableField value={data.skills} onChange={(v) => onChange('skills', v)} isEditing={isEditing} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.skills.split(',').map((skill, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </CreativeSection>

      {/* Portfolio as Cards */}
      <CreativeSection title="作品集" color="pink" fullWidth>
        {isEditing ? (
          <EditableField value={data.portfolio} onChange={(v) => onChange('portfolio', v)} isEditing={isEditing} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-24 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800" />
                <CardContent className="p-3">
                  <p className="text-sm font-medium">專案作品 {i}</p>
                  <p className="text-xs text-muted-foreground">掃描 QR Code 查看</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CreativeSection>
    </div>
  </div>
);

// Template Section Helper
const TemplateSection = ({ 
  title, 
  children, 
  isEditing 
}: { 
  title: string; 
  children: React.ReactNode; 
  isEditing: boolean;
}) => (
  <div>
    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">{title}</h2>
    <div className="text-sm text-slate-700">{children}</div>
  </div>
);

// Creative Section Helper
const CreativeSection = ({ 
  title, 
  children, 
  color,
  fullWidth = false,
}: { 
  title: string; 
  children: React.ReactNode; 
  color: 'purple' | 'pink';
  fullWidth?: boolean;
}) => (
  <div className={`p-4 rounded-lg bg-white/50 dark:bg-white/5 border-l-4 ${color === 'purple' ? 'border-purple-500' : 'border-pink-500'} ${fullWidth ? 'col-span-full' : ''}`}>
    <h3 className={`font-semibold mb-3 ${color === 'purple' ? 'text-purple-600' : 'text-pink-600'}`}>{title}</h3>
    <div className="text-sm">{children}</div>
  </div>
);

export default Optimize;
