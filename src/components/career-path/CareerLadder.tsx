import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { careerTemplates, mockResumeExperiences, mockTargetCareer } from '@/data/careerLadderTemplates';

interface StepData {
  id: number;
  title: string;
  duties: string[];
  source: 'real' | 'ai';
  subtitle?: string;
}

/* ── Chevron Arrow Component ── */
const ChevronStep = ({
  step,
  isCurrentStep,
  isReal,
  isMobile,
}: {
  step: StepData;
  isCurrentStep: boolean;
  isReal: boolean;
  isMobile: boolean;
}) => {
  const w = isMobile ? 140 : 170;
  const h = isMobile ? 200 : 230;
  const point = 18; // arrow tip depth

  // SVG chevron/arrow shape
  const pathD = `M0,0 L${w - point},0 L${w},${h / 2} L${w - point},${h} L0,${h} L${point},${h / 2} Z`;

  const fillColor = isCurrentStep
    ? 'hsl(152 69% 45%)'
    : isReal
      ? 'hsl(152 60% 88%)'
      : 'hsl(150 15% 95%)';

  const strokeColor = isCurrentStep
    ? 'hsl(152 65% 35%)'
    : isReal
      ? 'hsl(152 50% 70%)'
      : 'hsl(150 15% 85%)';

  const textColor = isCurrentStep
    ? 'text-primary-foreground'
    : isReal
      ? 'text-foreground'
      : 'text-muted-foreground';

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: w, height: h }}
    >
      {/* SVG chevron background */}
      <svg
        className="absolute inset-0"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
      >
        {/* Glow filter for current step */}
        {isCurrentStep && (
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}
        <path
          d={pathD}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          filter={isCurrentStep ? 'url(#glow)' : undefined}
        />
      </svg>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-3 text-center" style={{ paddingLeft: point + 8, paddingRight: point + 4 }}>
        {/* Status label */}
        <span className={cn(
          'text-[9px] font-bold uppercase tracking-wider mb-1',
          isCurrentStep ? 'text-primary-foreground/80' : isReal ? 'text-primary' : 'text-muted-foreground'
        )}>
          {isCurrentStep ? '📍 當前' : isReal ? '✅ 完成' : `步驟 ${step.id}`}
        </span>

        {/* Job title – auto-shrink for long text */}
        <h4 className={cn(
          'font-bold leading-tight mb-1.5',
          textColor,
          step.title.length > 8 ? (isMobile ? 'text-[11px]' : 'text-xs') : (isMobile ? 'text-xs' : 'text-sm'),
        )}>
          {step.title}
        </h4>

        {/* Subtitle */}
        {step.subtitle && (
          <p className={cn(
            'text-[9px] mb-1.5',
            isCurrentStep ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}>
            {step.subtitle}
          </p>
        )}

        {/* Duties */}
        <ul className="space-y-0.5 w-full">
          {step.duties.slice(0, 3).map((duty, idx) => (
            <li key={idx} className={cn(
              'text-[9px] leading-tight flex items-start gap-1',
              isCurrentStep ? 'text-primary-foreground/80' : isReal ? 'text-foreground/70' : 'text-muted-foreground'
            )}>
              <span className={cn(
                'h-1 w-1 rounded-full mt-[3px] shrink-0',
                isCurrentStep ? 'bg-primary-foreground/60' : isReal ? 'bg-primary/50' : 'bg-muted-foreground/40'
              )} />
              {duty}
            </li>
          ))}
        </ul>

        {/* Current indicator */}
        {isCurrentStep && (
          <span className="mt-1.5 text-[9px] text-primary-foreground font-semibold animate-pulse">
            ▸ 目前位置
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Transition Marker ── */
const TransitionMarker = ({ isMobile }: { isMobile: boolean }) => (
  <div className={cn('flex flex-col items-center justify-center flex-shrink-0', isMobile ? 'mx-1' : 'mx-2')}>
    <div className="w-px h-6 border-l-2 border-dashed border-primary/60" />
    <div className="relative my-1">
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
      <span className="relative text-[10px] font-semibold text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full whitespace-nowrap">
        建議路徑
      </span>
    </div>
    <div className="w-px h-6 border-l-2 border-dashed border-primary/60" />
  </div>
);

/* ── Template Switcher (Dev Tool) ── */
const templateKeys = Object.keys(careerTemplates) as Array<keyof typeof careerTemplates>;
const templateLabels: Record<string, string> = {
  frontend: '前端',
  backend: '後端',
  fullstack: '全端',
  data: '資料科學',
  ai: 'AI',
  devops: 'DevOps',
};

/* ── Main Component ── */
const CareerLadder = ({ isLoading }: { isLoading: boolean }) => {
  const isMobile = useIsMobile();
  const [activeTemplate, setActiveTemplate] = useState<string>(mockTargetCareer);
  const template = careerTemplates[activeTemplate];

  const steps = useMemo<StepData[]>(() => {
    const realSteps: StepData[] = mockResumeExperiences.map((exp, i) => ({
      id: i + 1,
      title: exp.title,
      duties: exp.duties,
      source: 'real' as const,
      subtitle: `${exp.company} · ${exp.period}`,
    }));

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
              <Skeleton key={i} className={cn('rounded-lg flex-shrink-0', isMobile ? 'w-[140px] h-[200px]' : 'w-[170px] h-[230px]')} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-4">
        {/* Template switcher */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {templateKeys.map((key) => (
            <Button
              key={key}
              size="sm"
              variant={activeTemplate === key ? 'default' : 'outline'}
              className="text-xs h-7 px-2.5"
              onClick={() => setActiveTemplate(key)}
            >
              {templateLabels[key]}
            </Button>
          ))}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              職涯階梯圖
            </CardTitle>
            <CardDescription className="text-xs md:text-sm mt-1">
              您的職涯發展路徑，當前位置以發光效果標示
            </CardDescription>
          </div>

          {/* Large stable mascot */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/15 rounded-full blur-2xl scale-75" />
            <img
              src={template.mascot}
              alt={`${template.name} 吉祥物`}
              className="relative object-contain drop-shadow-lg"
              style={{ width: isMobile ? 160 : 260, height: isMobile ? 160 : 260 }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chevron ladder – horizontally scrollable */}
        <div className="flex items-center gap-0 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const isCurrentStep = index === lastRealIndex;
            const isReal = step.source === 'real';
            const showTransition = index === lastRealIndex + 1;

            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                {showTransition && <TransitionMarker isMobile={isMobile} />}
                <ChevronStep
                  step={step}
                  isCurrentStep={isCurrentStep}
                  isReal={isReal}
                  isMobile={isMobile}
                />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[10px] md:text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'hsl(152 60% 88%)' }} />
            真實經歷
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-secondary border border-border" />
            AI 預測路徑
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary shadow-sm" style={{ boxShadow: '0 0 6px hsl(152 69% 45% / 0.5)' }} />
            當前位置
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerLadder;
