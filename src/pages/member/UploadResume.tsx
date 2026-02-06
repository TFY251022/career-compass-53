import { useState, useRef } from 'react';
import { Upload, FileText, User, Camera, X, Briefcase, GraduationCap, Award, Languages, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppState } from '@/contexts/AppContext';
import { AILoadingSpinner, ContentTransition, AnalysisSkeleton } from '@/components/loading/LoadingStates';
import AlertModal from '@/components/modals/AlertModal';
import { motion } from 'framer-motion';
import LoginRequired from '@/components/gatekeeper/LoginRequired';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface LanguageEntry {
  language: string;
  proficiency: string;
}

interface ResumeData {
  avatar?: string;
  name: string;
  bio: string;
  phone: string;
  email: string;
  education: string;
  experience: string;
  skills: string;
  languages: LanguageEntry[];
  certifications: string;
  projects: string;
  other: string;
}

const UploadResume = () => {
  const { setIsResumeUploaded } = useAppState();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFormatError, setShowFormatError] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<ResumeData>({
    avatar: '',
    name: '',
    bio: '',
    phone: '',
    email: '',
    education: '',
    experience: '',
    skills: '',
    languages: [{ language: '', proficiency: '' }],
    certifications: '',
    projects: '',
    other: '',
  });

  const [resultData, setResultData] = useState<ResumeData | null>(null);

  const languageOptions = ['中文', '英文', '台語', '日文', '韓文', '法文', '德文', '西班牙文', '其他'];
  const proficiencyOptions = [
    { value: '1', label: '1 - 入門' },
    { value: '2', label: '2 - 中等' },
    { value: '3', label: '3 - 精通' },
  ];

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisProgress(i);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAnalyzing(false);
    setShowResult(true);
    setIsResumeUploaded(true);
  };

  const handlePdfUpload = async (file: File) => {
    // Check file type
    if (file.type !== 'application/pdf') {
      setShowFormatError(true);
      return;
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationMessage('檔案大小超過 5MB 限制，請選擇較小的檔案');
      setShowValidationError(true);
      return;
    }

    setUploadedFileName(file.name);
    
    // Simulate PDF parsing result
    setResultData({
      avatar: '',
      name: '王小明',
      bio: '擁有 5 年軟體開發經驗的全端工程師，專精於 React 與 Node.js 開發，熱愛學習新技術並解決複雜問題。',
      phone: '0912-345-678',
      email: 'example@email.com',
      education: '國立台灣大學 資訊工程學系 碩士 (2018-2020)',
      experience: '資深前端工程師 - ABC科技公司 (2020-至今)\n前端工程師 - XYZ新創 (2018-2020)',
      skills: 'React, TypeScript, Node.js, Python, SQL, Git, Docker',
      languages: [
        { language: '中文', proficiency: '3' },
        { language: '英文', proficiency: '2' },
        { language: '台語', proficiency: '2' },
      ],
      certifications: 'AWS Certified Developer, Google Cloud Professional',
      projects: '電商平台重構專案、企業內部管理系統開發',
      other: '',
    });

    await simulateAnalysis();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePdfUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePdfUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: '' }],
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      { field: 'name', label: '姓名' },
      { field: 'bio', label: '自傳' },
      { field: 'phone', label: '聯絡電話' },
      { field: 'email', label: '聯絡信箱' },
      { field: 'education', label: '教育背景' },
      { field: 'experience', label: '工作經歷' },
      { field: 'skills', label: '技能專長' },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof ResumeData] || (formData[field as keyof ResumeData] as string).trim() === '') {
        setValidationMessage(`請填寫必填欄位：${label}`);
        setShowValidationError(true);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationMessage('請輸入有效的電子郵件地址');
      setShowValidationError(true);
      return false;
    }

    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    setResultData(formData);
    await simulateAnalysis();
  };

  const handleReset = () => {
    setShowResult(false);
    setResultData(null);
    setUploadedFileName('');
    setAnalysisProgress(0);
    setFormData({
      avatar: '',
      name: '',
      bio: '',
      phone: '',
      email: '',
      education: '',
      experience: '',
      skills: '',
      languages: [{ language: '', proficiency: '' }],
      certifications: '',
      projects: '',
      other: '',
    });
  };

  const getProficiencyLabel = (value: string) => {
    const option = proficiencyOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <LoginRequired>
      <div className="container py-8 md:py-12 animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 mb-4 md:mb-6">
            <Upload className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">上傳履歷</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            上傳您的履歷，開啟智慧職涯分析
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ContentTransition
            isLoading={isAnalyzing}
            skeleton={
              <div className="space-y-6">
                <Card className="border-primary/20">
                  <CardContent className="p-8 text-center">
                    <AILoadingSpinner message="正在分析中..." />
                    <div className="mt-6 max-w-md mx-auto">
                      <Progress value={analysisProgress} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">{analysisProgress}%</p>
                    </div>
                  </CardContent>
                </Card>
                <AnalysisSkeleton />
              </div>
            }
          >
            {showResult && resultData ? (
              <ResultView 
                data={resultData} 
                onReset={handleReset}
                onNavigate={() => navigate('/career-quiz')}
                onSave={(updated) => {
                  setResultData(updated);
                  setIsResumeUploaded(true);
                }}
              />
            ) : (
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    上傳 PDF 履歷
                  </TabsTrigger>
                  <TabsTrigger value="form" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    手動填寫履歷
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg">上傳履歷檔案</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        僅支援 PDF 格式，檔案大小不超過 5MB
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div 
                        className="border-2 border-dashed border-primary/30 rounded-xl p-8 md:p-12 text-center hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                        </div>
                        <p className="text-base md:text-lg font-medium mb-2">拖曳 PDF 檔案至此處</p>
                        <p className="text-muted-foreground text-sm mb-6">或點擊選擇檔案</p>
                        <Button className="gradient-primary pointer-events-none text-sm md:text-base">
                          選擇 PDF 檔案
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                          支援格式：PDF｜檔案上限：5MB
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="form">
                  <ResumeForm 
                    formData={formData}
                    setFormData={setFormData}
                    avatarInputRef={avatarInputRef}
                    handleAvatarChange={handleAvatarChange}
                    languageOptions={languageOptions}
                    proficiencyOptions={proficiencyOptions}
                    addLanguage={addLanguage}
                    removeLanguage={removeLanguage}
                    updateLanguage={updateLanguage}
                    onSubmit={handleFormSubmit}
                  />
                </TabsContent>
              </Tabs>
            )}
          </ContentTransition>
        </div>

        <AlertModal
          open={showFormatError}
          onClose={() => setShowFormatError(false)}
          type="error"
          title="格式不符"
          message="請上傳 PDF 格式的履歷檔案"
          confirmLabel="了解"
        />

        <AlertModal
          open={showValidationError}
          onClose={() => setShowValidationError(false)}
          type="error"
          title="資料不完整"
          message={validationMessage}
          confirmLabel="了解"
        />
      </div>
    </LoginRequired>
  );
};

interface ResumeFormProps {
  formData: ResumeData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeData>>;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  languageOptions: string[];
  proficiencyOptions: { value: string; label: string }[];
  addLanguage: () => void;
  removeLanguage: (index: number) => void;
  updateLanguage: (index: number, field: 'language' | 'proficiency', value: string) => void;
  onSubmit: () => void;
}

const ResumeForm = ({
  formData,
  setFormData,
  avatarInputRef,
  handleAvatarChange,
  languageOptions,
  proficiencyOptions,
  addLanguage,
  removeLanguage,
  updateLanguage,
  onSubmit,
}: ResumeFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">填寫履歷資料</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          請填寫以下資訊，標註 * 為必填欄位
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div 
            className="relative h-24 w-24 md:h-32 md:w-32 rounded-full bg-muted border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/60 transition-colors overflow-hidden group"
            onClick={() => avatarInputRef.current?.click()}
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">點擊上傳大頭貼</p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input
              id="name"
              placeholder="請輸入您的姓名"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">聯絡電話 *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="0912-345-678"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">聯絡信箱 *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">自傳 *</Label>
          <Textarea
            id="bio"
            placeholder="請簡述您的專業背景、職涯目標及個人特質..."
            className="min-h-[120px]"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          />
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label htmlFor="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            教育背景 *
          </Label>
          <Textarea
            id="education"
            placeholder="學校名稱、科系、學位、畢業年份..."
            value={formData.education}
            onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            工作經歷 *
          </Label>
          <Textarea
            id="experience"
            placeholder="公司名稱、職稱、任職期間、工作內容..."
            className="min-h-[100px]"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">技能專長 *</Label>
          <Textarea
            id="skills"
            placeholder="請列出您的專業技能，如：程式語言、設計軟體、語言能力等..."
            value={formData.skills}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
          />
        </div>

        {/* Language Abilities */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            語言能力
          </Label>
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={lang.language}
                onValueChange={(value) => updateLanguage(index, 'language', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="選擇語言" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={lang.proficiency}
                onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
              >
                <SelectTrigger className="w-32 md:w-40">
                  <SelectValue placeholder="熟練度" />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.languages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLanguage(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
            + 新增語言
          </Button>
        </div>

        {/* Certifications */}
        <div className="space-y-2">
          <Label htmlFor="certifications" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            證照與專案成就（選填）
          </Label>
          <Textarea
            id="certifications"
            placeholder="相關證照、專案經驗、成就..."
            value={formData.certifications}
            onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
          />
        </div>

        {/* Projects */}
        <div className="space-y-2">
          <Label htmlFor="projects">專案作品（選填）</Label>
          <Textarea
            id="projects"
            placeholder="個人專案、作品集連結..."
            value={formData.projects}
            onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value }))}
          />
        </div>

        {/* Other */}
        <div className="space-y-2">
          <Label htmlFor="other">其他（選填）</Label>
          <Textarea
            id="other"
            placeholder="其他想補充的資訊..."
            value={formData.other}
            onChange={(e) => setFormData(prev => ({ ...prev, other: e.target.value }))}
          />
        </div>

        <Button onClick={onSubmit} className="w-full gradient-primary">
          提交履歷資料
        </Button>
      </CardContent>
    </Card>
  );
};

interface ResultViewProps {
  data: ResumeData;
  onReset: () => void;
  onNavigate: () => void;
  onSave: (updated: ResumeData) => void;
}

const EditableField = ({
  label,
  value,
  field,
  isEditing,
  onChange,
  icon,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  field: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  icon?: React.ReactNode;
  multiline?: boolean;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
      {icon} {label}
    </h4>
    <div className="transition-all duration-300 ease-in-out">
      {isEditing ? (
        multiline ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className="text-sm transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)] focus:border-primary/60"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className="text-sm transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)] focus:border-primary/60"
          />
        )
      ) : (
        <p className="text-sm bg-background p-3 rounded-lg border whitespace-pre-line transition-all duration-300 ease-in-out">
          {value || <span className="text-muted-foreground italic">未填寫</span>}
        </p>
      )}
    </div>
  </div>
);

const ResultView = ({ data, onReset, onNavigate, onSave }: ResultViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ResumeData>({ ...data });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const getProficiencyLabel = (value: string) => {
    const labels: Record<string, string> = { '1': '入門', '2': '中等', '3': '精通' };
    return labels[value] || value;
  };

  const handleEnterEdit = () => {
    setEditData({ ...data });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData({ ...data });
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmSave = () => {
    onSave(editData);
    setIsEditing(false);
    setShowSaveConfirm(false);
  };

  const languageOptions = ['中文', '英文', '台語', '日文', '韓文', '法文', '德文', '西班牙文', '其他'];
  const proficiencyOptions = [
    { value: '1', label: '1 - 入門' },
    { value: '2', label: '2 - 中等' },
    { value: '3', label: '3 - 精通' },
  ];

  const updateEditLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    setEditData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => i === index ? { ...lang, [field]: value } : lang),
    }));
  };

  const addEditLanguage = () => {
    setEditData(prev => ({ ...prev, languages: [...prev.languages, { language: '', proficiency: '' }] }));
  };

  const removeEditLanguage = (index: number) => {
    setEditData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) }));
  };

  const displayData = isEditing ? editData : data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="relative pb-2">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto mb-2">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">履歷摘要報告</CardTitle>
            <CardDescription>以下是您的履歷資訊摘要</CardDescription>
          </div>
          {/* Edit / Cancel Toggle */}
          <div className="absolute right-6 top-6">
            {isEditing ? (
              <Button variant="outline" size="sm" onClick={handleCancelEdit} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <X className="h-4 w-4 mr-1" /> 取消編輯
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleEnterEdit} className="border-primary/30 text-primary hover:bg-primary/10">
                <FileText className="h-4 w-4 mr-1" /> 編輯資訊
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 bg-background rounded-lg border transition-all duration-300">
            {displayData.avatar ? (
              <img src={displayData.avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-primary/20" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-primary/20">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="text-center md:text-left flex-1 space-y-2">
              {isEditing ? (
                <Input
                  value={editData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="姓名"
                  className="text-lg font-semibold transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)] focus:border-primary/60"
                />
              ) : (
                <h3 className="text-lg font-semibold transition-all duration-300">{displayData.name}</h3>
              )}
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={editData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="聯絡電話"
                    className="text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)] focus:border-primary/60"
                  />
                  <Input
                    value={editData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="電子郵件"
                    className="text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)] focus:border-primary/60"
                  />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center justify-center md:justify-start gap-1">
                    <Phone className="h-4 w-4" /> {displayData.phone}
                  </span>
                  <span className="flex items-center justify-center md:justify-start gap-1">
                    <Mail className="h-4 w-4" /> {displayData.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          <EditableField label="自傳" value={displayData.bio} field="bio" isEditing={isEditing} onChange={handleFieldChange} multiline placeholder="請簡述您的專業背景..." />
          <EditableField label="教育背景" value={displayData.education} field="education" isEditing={isEditing} onChange={handleFieldChange} icon={<GraduationCap className="h-4 w-4" />} multiline placeholder="學校名稱、科系、學位..." />
          <EditableField label="工作經歷" value={displayData.experience} field="experience" isEditing={isEditing} onChange={handleFieldChange} icon={<Briefcase className="h-4 w-4" />} multiline placeholder="公司名稱、職稱、任職期間..." />
          <EditableField label="技能專長" value={displayData.skills} field="skills" isEditing={isEditing} onChange={handleFieldChange} multiline placeholder="程式語言、設計軟體..." />

          {/* Languages */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Languages className="h-4 w-4" /> 語言能力
            </h4>
            <div className="transition-all duration-300 ease-in-out">
              {isEditing ? (
                <div className="space-y-2">
                  {editData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select value={lang.language} onValueChange={(v) => updateEditLanguage(index, 'language', v)}>
                        <SelectTrigger className="flex-1 focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)]">
                          <SelectValue placeholder="選擇語言" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={lang.proficiency} onValueChange={(v) => updateEditLanguage(index, 'proficiency', v)}>
                        <SelectTrigger className="w-32 md:w-40 focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_12px_rgba(34,197,94,0.2)]">
                          <SelectValue placeholder="熟練度" />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {editData.languages.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEditLanguage(index)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addEditLanguage}>+ 新增語言</Button>
                </div>
              ) : (
                displayData.languages.some(lang => lang.language) && (
                  <div className="flex flex-wrap gap-2">
                    {displayData.languages.filter(lang => lang.language).map((lang, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {lang.language}
                        {lang.proficiency && <span className="text-xs opacity-75">({getProficiencyLabel(lang.proficiency)})</span>}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>

          <EditableField label="證照與專案成就" value={displayData.certifications} field="certifications" isEditing={isEditing} onChange={handleFieldChange} icon={<Award className="h-4 w-4" />} multiline placeholder="相關證照、專案經驗..." />
          <EditableField label="專案作品" value={displayData.projects} field="projects" isEditing={isEditing} onChange={handleFieldChange} multiline placeholder="個人專案、作品集連結..." />
          <EditableField label="其他" value={displayData.other} field="other" isEditing={isEditing} onChange={handleFieldChange} multiline placeholder="其他想補充的資訊..." />
        </CardContent>
      </Card>

      {/* Footer Actions */}
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Button onClick={() => setShowSaveConfirm(true)} className="w-full gradient-primary h-12 text-base font-semibold">
            確認並儲存
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onReset} className="flex-1">
            重新上傳 / 填寫
          </Button>
          <Button onClick={onNavigate} className="flex-1 gradient-primary">
            填寫職涯問卷
          </Button>
        </div>
      )}

      <AlertModal
        open={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        type="info"
        title="確認儲存資訊？"
        message="是否確認儲存目前的履歷資訊？這將作為後續職缺推薦的依據。"
        showCancel
        confirmLabel="確認儲存"
        cancelLabel="取消"
        onConfirm={handleConfirmSave}
      />
    </motion.div>
  );
};

export default UploadResume;
