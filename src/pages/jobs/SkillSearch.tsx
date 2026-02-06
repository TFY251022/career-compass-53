import { useState, useCallback } from 'react';
import { Search, Code, Layers, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AILoadingSpinner, CardSkeleton, ContentTransition } from '@/components/loading/LoadingStates';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

// ── Data structures ──────────────────────────────────────────────

interface SkillCard {
  name: string;
  tags: string[];
  description: string;
}

interface SubCategory {
  label: string;
  skills: SkillCard[];
}

interface JobCategory {
  label: string;
  subcategories: SubCategory[];
}

const JOB_CATEGORIES: JobCategory[] = [
  {
    label: '軟體工程師',
    subcategories: [
      {
        label: '前端工程師',
        skills: [
          { name: 'React', tags: ['框架', '前端'], description: '構建互動式使用者介面的主流 JavaScript 函式庫' },
          { name: 'TypeScript', tags: ['語言', '型別安全'], description: 'JavaScript 的超集，提供靜態型別檢查' },
          { name: 'Vue.js', tags: ['框架', '前端'], description: '漸進式 JavaScript 框架，易於上手' },
          { name: 'CSS/Tailwind', tags: ['樣式', '工具'], description: '現代 CSS 框架與工具鏈' },
          { name: 'Next.js', tags: ['框架', 'SSR'], description: 'React 全端框架，支援伺服器端渲染' },
          { name: 'Webpack/Vite', tags: ['建構工具'], description: '前端模組打包與建構工具' },
        ],
      },
      {
        label: '後端工程師',
        skills: [
          { name: 'Node.js', tags: ['執行環境', '後端'], description: '高效能 JavaScript 伺服器端執行環境' },
          { name: 'Python', tags: ['語言', '通用'], description: '廣泛用於後端、資料科學的通用語言' },
          { name: 'Java/Spring', tags: ['語言', '框架'], description: '企業級後端開發的首選技術棧' },
          { name: 'PostgreSQL', tags: ['資料庫', 'SQL'], description: '功能強大的開源關聯式資料庫' },
          { name: 'Redis', tags: ['快取', 'NoSQL'], description: '高效能鍵值存儲與快取系統' },
          { name: 'GraphQL', tags: ['API', '查詢語言'], description: '靈活的 API 查詢語言與規範' },
        ],
      },
      {
        label: '全端工程師',
        skills: [
          { name: 'React + Node.js', tags: ['全端', 'JS'], description: '最熱門的 JavaScript 全端技術組合' },
          { name: 'Docker', tags: ['容器化', 'DevOps'], description: '容器化部署與環境一致性管理' },
          { name: 'REST API 設計', tags: ['API', '架構'], description: '設計可擴展的 RESTful 服務介面' },
          { name: 'CI/CD', tags: ['自動化', 'DevOps'], description: '持續整合與持續部署流程' },
          { name: 'MongoDB', tags: ['資料庫', 'NoSQL'], description: '文件導向的 NoSQL 資料庫' },
          { name: 'AWS/GCP', tags: ['雲端', '基礎設施'], description: '主流雲端平台服務與架構' },
        ],
      },
      {
        label: '資料科學家',
        skills: [
          { name: 'Python/Pandas', tags: ['語言', '資料處理'], description: '資料科學領域最主流的分析工具' },
          { name: 'SQL 進階', tags: ['資料庫', '分析'], description: '複雜查詢、窗函式與效能調校' },
          { name: 'Tableau/Power BI', tags: ['視覺化', '工具'], description: '商業智慧資料視覺化平台' },
          { name: '統計與機率', tags: ['數學', '基礎'], description: '假說檢定、回歸分析等統計方法' },
          { name: 'Spark', tags: ['大數據', '分散式'], description: '大規模資料分散式運算框架' },
          { name: 'ETL Pipeline', tags: ['資料工程'], description: '資料擷取、轉換與載入流程設計' },
        ],
      },
      {
        label: 'AI / 演算法工程師',
        skills: [
          { name: 'TensorFlow/PyTorch', tags: ['深度學習', '框架'], description: '主流深度學習模型訓練框架' },
          { name: 'NLP', tags: ['AI', '自然語言'], description: '自然語言處理與文本分析技術' },
          { name: 'Computer Vision', tags: ['AI', '影像'], description: '影像辨識、物件偵測等電腦視覺應用' },
          { name: 'MLOps', tags: ['部署', '維運'], description: '機器學習模型的部署與監控流程' },
          { name: 'LLM/RAG', tags: ['生成式AI'], description: '大型語言模型與檢索增強生成技術' },
          { name: '演算法與資料結構', tags: ['基礎', '面試'], description: '核心演算法設計與最佳化能力' },
        ],
      },
      {
        label: 'DevOps / SRE',
        skills: [
          { name: 'Kubernetes', tags: ['容器編排', '雲原生'], description: '容器化應用的自動部署與管理平台' },
          { name: 'Terraform', tags: ['IaC', '自動化'], description: '基礎設施即程式碼工具' },
          { name: '監控/Grafana', tags: ['可觀測性'], description: '系統監控、告警與儀表板建置' },
          { name: 'Linux 系統管理', tags: ['作業系統'], description: '伺服器環境管理與疑難排解' },
          { name: 'CI/CD Pipeline', tags: ['自動化', '部署'], description: 'Jenkins、GitHub Actions 等流程設計' },
          { name: '資安基礎', tags: ['安全', '合規'], description: '網路安全、權限管理與合規實踐' },
        ],
      },
    ],
  },
  // Future categories can be added here
];

// ── Icon helper ──────────────────────────────────────────────────

const SkillIcon = ({ skillName }: { skillName: string }) => {
  const [imgError, setImgError] = useState(true); // default to fallback until icons are uploaded
  const iconPath = `/icons/${skillName.toLowerCase().replace(/[\s\/\+\.]/g, '_')}_icon.png`;

  if (imgError) {
    // Alternate between two placeholder icons for visual variety
    const hash = skillName.charCodeAt(0);
    return hash % 2 === 0
      ? <Code className="h-8 w-8 text-primary" />
      : <Layers className="h-8 w-8 text-primary" />;
  }

  return (
    <img
      src={iconPath}
      alt={`${skillName} icon`}
      className="h-8 w-8 object-contain"
      onError={() => setImgError(true)}
    />
  );
};

// ── Skeleton for skill grid ──────────────────────────────────────

const SkillGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// ── Main Component ───────────────────────────────────────────────

const SkillSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SkillCard[]>([]);

  // Derived data
  const currentCategory = JOB_CATEGORIES.find(c => c.label === selectedCategory);
  const subcategories = currentCategory?.subcategories ?? [];

  // Reset subcategory when category changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSub('');
    setHasSearched(false);
    setResults([]);
  };

  const handleSearch = useCallback(async () => {
    if (!selectedCategory || !selectedSub) return;

    setIsLoading(true);
    setHasSearched(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const sub = subcategories.find(s => s.label === selectedSub);
    setResults(sub?.skills ?? []);
    setIsLoading(false);
  }, [selectedCategory, selectedSub, subcategories]);

  return (
    <div className="container py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">職涯地圖</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          選擇您感興趣的職務類別，探索所需的核心技能
        </p>
      </div>

      {/* Search Controls */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Layer 1: Job Category */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="flex-1 bg-card">
              <SelectValue placeholder="選擇職務大類" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              {JOB_CATEGORIES.map(cat => (
                <SelectItem key={cat.label} value={cat.label}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Layer 2: Subcategory */}
          <Select
            value={selectedSub}
            onValueChange={setSelectedSub}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="flex-1 bg-card">
              <SelectValue placeholder={selectedCategory ? '選擇細分項目' : '請先選擇職務大類'} />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              {subcategories.map(sub => (
                <SelectItem key={sub.label} value={sub.label}>
                  {sub.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="gradient-primary min-w-[100px]"
            onClick={handleSearch}
            disabled={isLoading || !selectedCategory || !selectedSub}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                搜尋中
              </span>
            ) : (
              <>
                <Search className="h-4 w-4" />
                搜尋
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        <ContentTransition
          isLoading={isLoading}
          skeleton={
            <div className="space-y-4">
              <AILoadingSpinner message="正在為您分析相關技能..." />
              <SkillGridSkeleton />
            </div>
          }
        >
          {hasSearched && results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-muted-foreground mb-6">
                {selectedSub} — 共 {results.length} 項核心技能
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-medium hover:ring-1 hover:ring-primary/40 hover:shadow-[0_0_16px_hsl(152_69%_45%/0.15)]">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 shrink-0">
                            <SkillIcon skillName={skill.name} />
                          </div>
                          <CardTitle className="text-base">{skill.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {skill.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : hasSearched ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">沒有找到相關技能，請嘗試其他類別</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">請選擇職務類別並按下搜尋</p>
              </CardContent>
            </Card>
          )}
        </ContentTransition>
      </div>
    </div>
  );
};

export default SkillSearch;
