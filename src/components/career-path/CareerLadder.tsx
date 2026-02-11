import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { careerTemplates, mockResumeExperiences, mockTargetCareer } from '@/data/careerLadderTemplates';

interface StepData {
  id: number;
  title: string;
  duties: string[];
  source: 'real' | 'ai';
  subtitle?: string; // company/period for real, level label for ai
}

const CareerLadder = ({ isLoading }: { isLoading: boolean }) => {
  const isMobile = useIsMobile();
  const template = careerTemplates[mockTargetCareer];

  const steps = useMemo<StepData[]>(() => {
    const realSteps: StepData[] = mockResumeExperiences.map((exp, i) => ({
      id: i + 1,
      title: exp.title,
      duties: exp.duties,
      source: 'real' as const,
      subtitle: `${exp.company} · ${exp.period}`,
    }));

    // Find where future starts: skip template levels that match real experience count
    const futureStart = realSteps.length;
    const futureLevels = template.levels.slice(futureStart);
    const futureSteps: StepData[] = futureLevels.map((lvl, i) => ({
      id: futureStart + i + 1,
      title: lvl.title,
      duties: lvl.duties,
      source: 'ai' as const,
      subtitle: `Level ${lvl.level}`,
    }));

    return [...realSteps, ...futureSteps];
  }, [template]);

  const lastRealIndex = mockResumeExperiences.length - 1;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <Skeleton className="w-40 h-5" />
          <Skeleton className="w-64 h-4 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn("flex flex-col items-center", isMobile ? "min-w-[150px] flex-shrink-0" : "flex-1 min-w-[170px]")}>
                <Skeleton className={cn("w-full rounded-lg", isMobile ? "h-28" : "h-36")} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              職涯階梯圖
            </CardTitle>
            <CardDescription className="text-xs md:text-sm mt-1">
              您的職涯發展路徑，當前位置以發光效果標示
            </CardDescription>
          </div>
          {/* Mascot */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-90" />
            <img
              src={template.mascot}
              alt={`${template.name} 吉祥物`}
              className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
            />
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-3 overflow-x-auto pb-4 items-start"
        >
          {steps.map((step, index) => {
            const isCurrentStep = index === lastRealIndex;
            const isReal = step.source === 'real';
            const showTransitionMarker = index === lastRealIndex + 1;

            return (
              <div key={step.id} className="flex items-start flex-shrink-0">
                {/* AI Transition Marker */}
                {showTransitionMarker && (
                  <div className="flex flex-col items-center mx-2 md:mx-3 pt-4 flex-shrink-0">
                    <div className="w-px h-8 border-l-2 border-dashed border-primary/50" />
                    <span className="text-[10px] md:text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap my-1">
                      AI 建議路徑
                    </span>
                    <div className="w-px h-8 border-l-2 border-dashed border-primary/50" />
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "rounded-xl border-2 p-3 md:p-4 transition-all duration-300",
                    isMobile ? "min-w-[160px] w-[160px]" : "min-w-[180px] w-[180px]",
                    isCurrentStep
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 ring-2 ring-primary/30"
                      : isReal
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-card"
                  )}
                >
                  {/* Step label */}
                  <div className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider mb-1",
                    isReal ? "text-primary" : "text-muted-foreground"
                  )}>
                    {isCurrentStep ? '📍 當前階段' : isReal ? '✅ 已完成' : `步驟 ${step.id}`}
                  </div>

                  {/* Title */}
                  <h4 className={cn(
                    "font-bold mb-1 leading-tight",
                    isMobile ? "text-sm" : "text-sm md:text-base",
                    isCurrentStep ? "text-primary" : "text-foreground"
                  )}>
                    {step.title}
                  </h4>

                  {/* Subtitle */}
                  {step.subtitle && (
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-2">{step.subtitle}</p>
                  )}

                  {/* Duties */}
                  <ul className="space-y-0.5">
                    {step.duties.map((duty, idx) => (
                      <li key={idx} className={cn(
                        "text-[10px] md:text-xs flex items-start gap-1.5",
                        isReal ? "text-foreground/80" : "text-muted-foreground"
                      )}>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full mt-1 shrink-0",
                          isCurrentStep ? "bg-primary" : isReal ? "bg-primary/50" : "bg-muted-foreground/40"
                        )} />
                        {duty}
                      </li>
                    ))}
                  </ul>

                  {/* Current step glow */}
                  {isCurrentStep && (
                    <div className="mt-2 text-[10px] text-primary font-medium text-center animate-pulse">
                      ▸ 目前位置
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[10px] md:text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/30 border border-primary/40" />
            真實經歷
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-card border border-border" />
            AI 預測路徑
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary border border-primary shadow-sm shadow-primary/30" />
            當前位置
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerLadder;
