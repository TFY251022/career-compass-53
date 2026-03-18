import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/contexts/AppContext";
import { AILoadingSpinner } from "@/components/loading/LoadingStates";
import EmbeddedPreferenceSurvey from "@/components/survey/EmbeddedPreferenceSurvey";
import ResumeSelector from "@/components/survey/ResumeSelector";
import AlertModal from "@/components/modals/AlertModal";
import RecommendationJobCard from "@/components/jobs/RecommendationJobCard";
import type { RecommendedJob } from "@/types/job";
import { getRecommendedJobs } from "@/services/jobService";

// Job Card Skeleton
const JobCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-lg flex-shrink-0" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

// ─── Stage type ───
type Stage = "survey" | "loading" | "results";

const Recommendations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isJobPreferenceQuizDone, setIsJobPreferenceQuizDone } = useAppState();

  const [stage, setStage] = useState<Stage>(isJobPreferenceQuizDone ? "results" : "survey");
  const [showRefillAlert, setShowRefillAlert] = useState(false);

  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isJobPreferenceQuizDone && stage === "survey") {
      setStage("results");
    }
  }, [isJobPreferenceQuizDone]);

  const JOBS_PER_PAGE = 5;
  const loadJobs = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getRecommendedJobs(page);
      setJobs(data);
      // 動態計算總頁數：只有一頁（模擬資料全部回傳）
      setTotalPages(data.length < JOBS_PER_PAGE ? 1 : Math.ceil(data.length / JOBS_PER_PAGE));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stage === "results") {
      loadJobs(currentPage);
    }
  }, [currentPage, stage]);

  useEffect(() => {
    const urlPageParam = parseInt(searchParams.get("page") || "1", 10);
    const validPage = isNaN(urlPageParam) || urlPageParam < 1 ? 1 : Math.min(urlPageParam, totalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }
  }, [searchParams, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSurveyComplete = () => {
    setStage("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsJobPreferenceQuizDone(true);
      setStage("results");
      setCurrentPage(1);
      setSearchParams({ page: "1" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1800);
  };

  const handleRefillConfirm = () => {
    setShowRefillAlert(false);
    setIsJobPreferenceQuizDone(false);
    setStage("survey");
    setJobs([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="container py-8 md:py-12 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {/* ─── Stage 1: Survey ─── */}
          {stage === "survey" && (
            <motion.div
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">設定您的工作偏好</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  告訴我們您的工作偏好，我們將為您精準匹配最適合的職缺
                </p>
              </div>
              <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
                <ResumeSelector />
                <EmbeddedPreferenceSurvey onComplete={handleSurveyComplete} />
              </div>
            </motion.div>
          )}

          {/* ─── Stage 2: Loading ─── */}
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <AILoadingSpinner message="正在根據您的偏好為您尋找合適職缺..." />
            </motion.div>
          )}

          {/* ─── Stage 3: Results ─── */}
          {stage === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">推薦職缺</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  我們根據您的履歷、個性特質與工作偏好，精心挑選最適合您的職位機會
                </p>
              </div>

              <div className="max-w-4xl mx-auto mb-6">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowRefillAlert(true)}>
                  <RefreshCw className="h-4 w-4" />
                  重新填寫工作偏好
                </Button>
              </div>

              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-4 w-full min-w-0"
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
                      className="grid gap-4 w-full min-w-0"
                    >
                      {jobs.map((job, index) => (
                        <motion.div
                          key={`${job.job_title}-${job.company_name}-${index}`}
                          className="w-full min-w-0"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <RecommendationJobCard job={job} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pagination */}
                {!isLoading && jobs.length > 0 && (
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
                      {getPageNumbers().map((page, idx) =>
                        typeof page === "number" ? (
                          <Button
                            key={idx}
                            variant={currentPage === page ? "default" : "outline"}
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
                        ),
                      )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AlertModal
        open={showRefillAlert}
        onClose={() => setShowRefillAlert(false)}
        type="warning"
        title="確認重新填寫？"
        message="重新填寫將會更新您的推薦職缺清單，是否確認重新填寫？"
        confirmLabel="確認重新填寫"
        onConfirm={handleRefillConfirm}
        showCancel
      />
    </div>
  );
};

export default Recommendations;
