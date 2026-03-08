import { motion } from 'framer-motion';
import { Star, Shield, AlertTriangle, Zap, ShieldAlert, Target, TrendingUp, Clock, CalendarDays, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { splitIntoParagraphs } from '@/utils/textFormat';
import type { ResumeDiagnosticResult } from '@/types/resume';
import type { AnalysisResult } from '@/types/analysis';
import { parseSWOT } from '@/types/analysis';

/* ── Resume Optimization Report Preview ── */
export function OptimizeReportPreview({ data }: { data: ResumeDiagnosticResult }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* 核心定位分析 */}
      <section>
        <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">一、核心定位分析</h3>
        <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 mb-3">
          <p className="text-[11px] font-semibold text-primary mb-1">候選人定位</p>
          <div className="text-xs text-foreground leading-relaxed space-y-1.5">
            {splitIntoParagraphs(data.candidate_positioning).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="rounded-lg bg-muted/50 border p-3">
          <p className="text-[11px] font-semibold text-muted-foreground mb-1">目標職位落差摘要</p>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
            {splitIntoParagraphs(data.target_role_gap_summary).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* 優劣勢對比 */}
      <section>
        <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">二、優劣勢對比分析</h3>
        {data.overall_strengths.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-emerald-600 mb-2">整體優勢</h4>
            <div className="space-y-1.5">
              {data.overall_strengths.map((s, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-md bg-emerald-500/5">
                  <span className="text-emerald-500 mt-0.5 text-xs">●</span>
                  <p className="text-xs leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.overall_weaknesses.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-amber-700 mb-2">待改善項目</h4>
            <div className="space-y-1.5">
              {data.overall_weaknesses.map((w, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-md bg-amber-500/5">
                  <span className="text-amber-600 mt-0.5 text-xs">●</span>
                  <p className="text-xs leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 關鍵問題診斷 */}
      {data.critical_issues.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">三、關鍵問題診斷</h3>
          <div className="space-y-3">
            {data.critical_issues.map((issue, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b">
                  <strong className="text-xs">{issue.section}</strong>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{issue.severity}</Badge>
                </div>
                <div className="p-3 space-y-2.5">
                  <div className="rounded bg-muted/40 border p-2.5">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1">原文內容</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{issue.original_text}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1">診斷分析</p>
                    <p className="text-xs leading-relaxed">{issue.issue_reason}</p>
                  </div>
                  <div className="rounded bg-primary/5 border border-primary/15 p-2.5">
                    <p className="text-[10px] font-semibold text-primary mb-1">優化方向</p>
                    <p className="text-xs font-medium text-primary/90 leading-relaxed">{issue.improvement_direction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 後續行動計畫 */}
      {data.recommended_next_actions.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">四、後續行動計畫</h3>
          <div className="space-y-2">
            {data.recommended_next_actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg border bg-card">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

/* ── Skills Analysis Report Preview ── */
export function SkillsReportPreview({ data }: { data: AnalysisResult }) {
  const swot = data.gap_analysis?.target_position?.gap_description
    ? parseSWOT(data.gap_analysis.target_position.gap_description)
    : null;

  const swotItems = swot ? [
    { label: '優勢', text: swot.strengths, color: 'text-emerald-600', bg: 'bg-emerald-500/5', border: 'border-l-emerald-500' },
    { label: '劣勢', text: swot.weaknesses, color: 'text-amber-600', bg: 'bg-amber-500/5', border: 'border-l-amber-500' },
    { label: '機會', text: swot.opportunities, color: 'text-sky-600', bg: 'bg-sky-500/5', border: 'border-l-sky-500' },
    { label: '威脅', text: swot.threats, color: 'text-rose-600', bg: 'bg-rose-500/5', border: 'border-l-rose-500' },
  ].filter(s => s.text) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* 核心洞察 */}
      <section>
        <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">一、核心洞察</h3>
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1">產業洞察</h4>
          <div className="text-xs leading-relaxed space-y-1.5">
            {splitIntoParagraphs(data.preliminary_summary?.industry_insight || '').map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
          <h4 className="text-xs font-bold text-primary mb-1">⭐ 個人總結</h4>
          <div className="text-xs font-medium text-primary/90 leading-relaxed space-y-1.5">
            {splitIntoParagraphs(data.preliminary_summary?.personal_summary || '').map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* 職能雷達圖數據 */}
      {data.radar_chart?.dimensions && (
        <section>
          <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">二、職能雷達圖</h3>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-3 py-2 font-semibold">維度</th>
                  <th className="text-center px-3 py-2 font-semibold">您的分數</th>
                  {data.target_radar?.dimensions && <th className="text-center px-3 py-2 font-semibold">目標基準</th>}
                </tr>
              </thead>
              <tbody>
                {data.radar_chart.dimensions.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{d.axis}</td>
                    <td className="text-center px-3 py-2 font-medium">{d.score} / 5</td>
                    {data.target_radar?.dimensions && (
                      <td className="text-center px-3 py-2 text-muted-foreground">{data.target_radar.dimensions[i]?.score ?? '-'} / 5</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 領航員分析職類 */}
      {data.gap_analysis?.target_position && (
        <section>
          <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">三、領航員分析職類</h3>
          <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 mb-3">
            <p className="text-[11px] text-muted-foreground mb-1">領航員分析您適合的職類</p>
            <p className="text-lg font-bold text-primary">
              {data.gap_analysis.target_position.role}
              <span className="text-xs ml-2 font-normal text-muted-foreground">匹配度 {data.gap_analysis.target_position.match_score}%</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg border p-2.5">
              <p className="text-[10px] text-muted-foreground mb-0.5">自評等級</p>
              <p className="text-sm font-bold">{data.gap_analysis.current_status.self_assessment}</p>
            </div>
            <div className="rounded-lg border p-2.5">
              <p className="text-[10px] text-muted-foreground mb-0.5">實際等級</p>
              <p className="text-sm font-bold text-primary">{data.gap_analysis.current_status.actual_level}</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs font-semibold mb-1">認知偏差分析</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{data.gap_analysis.current_status.cognitive_bias}</p>
          </div>
        </section>
      )}

      {/* SWOT 分析 */}
      {swotItems.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">四、SWOT 分析</h3>
          <div className="space-y-2">
            {swotItems.map((item, i) => (
              <div key={i} className={`rounded-lg ${item.bg} border-l-4 ${item.border} p-3`}>
                <strong className={`text-xs ${item.color}`}>{item.label}</strong>
                <p className="text-xs leading-relaxed mt-1">{item.text}</p>
              </div>
            ))}
          </div>
          {swot?.gap && (
            <div className="mt-3 rounded-lg border-2 border-primary p-3 bg-gradient-to-br from-primary/5 to-background">
              <strong className="text-xs text-primary">核心落差</strong>
              <p className="text-xs font-medium text-primary/90 leading-relaxed mt-1">{swot.gap}</p>
            </div>
          )}
        </section>
      )}

      {/* 職涯行動計畫 */}
      {data.gap_analysis?.action_plan && (
        <section>
          <h3 className="text-sm font-semibold text-primary mb-3 border-b border-primary pb-1.5">五、職涯行動計畫</h3>
          <div className="space-y-2">
            {[
              { icon: Clock, label: '短期計畫', text: data.gap_analysis.action_plan.short_term },
              { icon: CalendarDays, label: '中期計畫', text: data.gap_analysis.action_plan.mid_term },
              { icon: CalendarRange, label: '長期計畫', text: data.gap_analysis.action_plan.long_term },
            ].filter(p => p.text).map((plan, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg border">
                <plan.icon className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-primary mb-0.5">{plan.label}</p>
                  <p className="text-xs leading-relaxed">{plan.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
