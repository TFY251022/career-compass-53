import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAppState } from '@/contexts/AppContext';
import AuthModal from '@/components/auth/AuthModal';
import RightDrawer from '@/components/panels/RightDrawer';
import { AILoadingSpinner } from '@/components/loading/LoadingStates';
import JobDetailHeader from '@/components/jobs/detail/JobDetailHeader';
import JobDetailContent from '@/components/jobs/detail/JobDetailContent';
import JobDetailUserAnalysis from '@/components/jobs/detail/JobDetailUserAnalysis';
import JobDetailSkeleton from '@/components/jobs/detail/JobDetailSkeleton';
import type { RecommendedJobDetail } from '@/types/job';
import { getJobDetail, generateCoverLetter } from '@/services/jobService';
import {
  ChevronLeft,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAppState();

  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<RecommendedJobDetail | null>(null);

  // Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Cover letter drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterContent, setLetterContent] = useState<{ subject: string; body: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getJobDetail(id)
      .then(setJob)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleGenerateLetter = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setDrawerOpen(true);
    setIsGenerating(true);
    setLetterContent(null);
    setIsCopied(false);

    const result = await generateCoverLetter(job?.job_title, job?.company_name);
    setLetterContent(result);
    setIsGenerating(false);
  };

  const handleCopyContent = async () => {
    if (!letterContent) return;
    const fullContent = `主旨：${letterContent.subject}\n\n${letterContent.body}`;
    await navigator.clipboard.writeText(fullContent);
    setIsCopied(true);
    toast.success('已複製到剪貼簿');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!letterContent) return;
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const fullContent = `主旨：${letterContent.subject}\n\n${letterContent.body}`;
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `推薦信_${job?.company_name}_${job?.job_title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
    toast.success('推薦信已下載');
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="container py-8 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            {/* Back navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Button
                variant="link"
                onClick={() => navigate('/jobs/recommendations')}
                className="gap-2 px-0 text-[#8d4903] hover:text-[#8d4903]/80"
              >
                <ChevronLeft className="h-4 w-4" />
                返回推薦職缺列表
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <JobDetailSkeleton />
                </motion.div>
              ) : job ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Section 1: Header */}
                  <JobDetailHeader
                    job={job}
                    onGenerateLetter={handleGenerateLetter}
                  />

                  {/* Section 2: Job Content */}
                  <JobDetailContent job={job} />

                  {/* Section 3: User Analysis */}
                  <JobDetailUserAnalysis job={job} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">找不到此職缺資訊</p>
                  <Button onClick={() => navigate('/jobs/recommendations')} className="mt-4">
                    返回推薦職缺列表
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cover Letter Right Drawer */}
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="AI 推薦信生成"
        subtitle="根據職缺內容與您的履歷生成"
        showDownload={!!letterContent}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <AILoadingSpinner message="正在為您撰寫個人化推薦信..." />
          ) : letterContent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-muted/50 rounded-lg p-4 border">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">主旨</label>
                <p className="mt-1 font-medium">{letterContent.subject}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">內容</label>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{letterContent.body}</p>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={handleCopyContent}>
                {isCopied ? (
                  <><CheckCircle2 className="h-4 w-4 text-primary" />已複製</>
                ) : (
                  <><Copy className="h-4 w-4" />複製內容</>
                )}
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </RightDrawer>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default JobDetail;
