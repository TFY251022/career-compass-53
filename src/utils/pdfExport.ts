import html2pdf from 'html2pdf.js';

interface PdfExportOptions {
  filename: string;
  htmlContent: string;
  margin?: [number, number, number, number];
}

/**
 * Generate and download a PDF from an HTML string.
 * Uses html2pdf.js under the hood (html → canvas → PDF).
 */
export async function exportHtmlToPdf({
  filename,
  htmlContent,
  margin = [12, 12, 12, 12],
}: PdfExportOptions): Promise<void> {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlContent;
  wrapper.style.width = '700px';
  wrapper.style.fontFamily = "'Noto Sans TC', 'Microsoft JhengHei', sans-serif";
  wrapper.style.color = '#333';
  wrapper.style.lineHeight = '1.85';
  wrapper.style.fontSize = '13px';
  wrapper.style.letterSpacing = '0.3px';
  document.body.appendChild(wrapper);

  const opt = {
    margin,
    filename,
    image: { type: 'jpeg' as const, quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: { mode: ['avoid-all', 'css'] },
  };

  try {
    await html2pdf().set(opt).from(wrapper).save();
  } finally {
    document.body.removeChild(wrapper);
  }
}

/* ── Report HTML builders ── */

const h = (tag: string, style: string, content: string) =>
  `<${tag} style="${style}">${content}</${tag}>`;

const sectionTitle = (text: string) =>
  h('h2', 'font-size:16px;color:#1F3A5F;border-bottom:2px solid #1F3A5F;padding-bottom:8px;margin:28px 0 14px;letter-spacing:0.5px;', text);

const bulletList = (items: string[]) =>
  `<ul style="padding-left:18px;margin:0;">${items.map(i => `<li style="margin-bottom:6px;line-height:1.85;">${i}</li>`).join('')}</ul>`;

/** 履歷優化建議報告 */
export function buildSuggestionsReportHtml(suggestions: { section: string; original: string; optimized: string }[]): string {
  const rows = suggestions.map(s => `
    <div style="margin-bottom:16px;page-break-inside:avoid;">
      <h3 style="font-size:14px;color:#333;margin:0 0 6px;">【${s.section}】</h3>
      <p style="margin:0 0 4px;"><strong style="color:#888;">原始：</strong>${s.original}</p>
      <p style="margin:0;"><strong style="color:#1F3A5F;">優化建議：</strong>${s.optimized}</p>
    </div>
  `).join('');
  return `
    <div>
      ${h('h1', 'font-size:22px;text-align:center;color:#1F3A5F;margin-bottom:4px;', '履歷優化建議報告')}
      ${h('p', 'text-align:center;color:#888;font-size:12px;margin-bottom:24px;', `生成日期：${new Date().toLocaleDateString('zh-TW')}`)}
      ${rows}
    </div>
  `;
}

/** 職能圖譜分析報告 */
export function buildSkillsReportHtml(data: {
  industryInsight: string;
  personalSummary: string;
  radarDimensions: { axis: string; score: number }[];
  targetRadarDimensions?: { axis: string; score: number }[];
  selfAssessment: string;
  actualLevel: string;
  cognitiveBias: string;
  targetRole: string;
  matchScore: number;
  swot: { strengths: string; weaknesses: string; opportunities: string; threats: string; gap: string };
  actionPlan: { short_term: string; mid_term: string; long_term: string };
  learningResources: { title: string; description: string; tags?: string[]; rating?: number; review_count?: number; level?: string; course_type?: string; duration?: string; priority?: number; strategy_reason?: string; link?: string }[];
  sideProjects: { name: string; name_en?: string; capability_gaps: string[]; technologies: string[]; phases: { phase_name: string; goal: string; tasks: string[]; resume_value: string }[]; overall_resume_impact: string; difficulty: number; difficulty_label?: string; estimated_duration?: string; difficulty_note?: string }[];
  overallStrategy?: string;
  milestones?: string[];
}): string {
  const swotBlock = (label: string, color: string, text: string) =>
    text ? `<div style="margin-bottom:12px;padding:12px 16px;border-left:4px solid ${color};background:${color}10;border-radius:6px;">
      <strong style="color:${color};letter-spacing:0.3px;">${label}</strong>
      <p style="margin:6px 0 0;font-size:13px;line-height:1.85;">${text}</p>
    </div>` : '';

  const starRating = (rating: number) => {
    const full = Math.floor(rating);
    const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
    return `<span style="color:#d97706;letter-spacing:1px;">${stars}</span> <span style="font-size:12px;color:#888;">${rating}</span>`;
  };

  const difficultyDots = (level: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:3px;background:${i < level ? '#8d4903' : '#ddd'};"></span>`
    ).join('');
  };

  const resourceCards = data.learningResources.map((r, i) => {
    const metaParts: string[] = [];
    if (r.rating != null) metaParts.push(starRating(r.rating));
    if (r.review_count != null) metaParts.push(`${r.review_count.toLocaleString()} 則評論`);
    if (r.course_type) metaParts.push(r.course_type);
    if (r.duration) metaParts.push(`⏱ ${r.duration}`);
    if (r.level) metaParts.push(r.level);

    return `<div style="border:1px solid #e5e0db;border-radius:8px;padding:16px;margin-bottom:12px;page-break-inside:avoid;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        ${r.priority != null ? `<span style="background:#8d4903;color:#fff;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;">優先 ${r.priority}</span>` : '<span></span>'}
        ${r.level ? `<span style="border:1px solid #ccc;padding:2px 8px;border-radius:12px;font-size:11px;color:#666;">${r.level}</span>` : ''}
      </div>
      <h3 style="font-size:14px;margin:0 0 6px;color:#1F3A5F;">${r.title}</h3>
      <div style="font-size:11px;color:#888;margin-bottom:6px;">${metaParts.join(' · ')}</div>
      <p style="font-size:13px;margin:0 0 8px;color:#444;">${r.description}</p>
      ${r.strategy_reason ? `<div style="background:#fbf1e8;padding:8px 12px;border-radius:6px;margin-bottom:8px;">
        <p style="margin:0;font-size:12px;color:#502D03;"><strong>策略原因：</strong>${r.strategy_reason}</p>
      </div>` : ''}
      ${r.tags && r.tags.length > 0 ? `<div style="margin-top:4px;">${r.tags.map(t => `<span style="display:inline-block;background:#f0ebe5;color:#675143;padding:2px 8px;border-radius:10px;font-size:11px;margin-right:4px;">${t}</span>`).join('')}</div>` : ''}
    </div>`;
  }).join('');

  return `
    <div>
      ${h('h1', 'font-size:24px;text-align:center;color:#1F3A5F;margin-bottom:6px;letter-spacing:1px;', '職能分析報告')}
      ${h('p', 'text-align:center;color:#999;font-size:12px;margin-bottom:32px;', `生成日期：${new Date().toLocaleDateString('zh-TW')}`)}

      ${sectionTitle('一、核心洞察')}
      ${h('h3', 'font-size:14px;color:#675143;margin:0 0 6px;letter-spacing:0.3px;', '產業洞察')}
      <p style="margin-bottom:16px;line-height:1.85;">${data.industryInsight}</p>
      ${h('h3', 'font-size:15px;color:#502D03;margin:0 0 6px;font-weight:700;letter-spacing:0.3px;', '⭐ 個人總結')}
      <p style="font-weight:600;color:#502D03;margin-bottom:0;line-height:1.85;">${data.personalSummary}</p>

      ${sectionTitle('二、職能雷達圖')}
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:12px;">
        <tr style="background:#f5f0eb;"><th style="text-align:left;padding:8px 12px;">維度</th><th style="text-align:center;padding:8px 12px;">您的分數</th>${data.targetRadarDimensions ? '<th style="text-align:center;padding:8px 12px;">目標基準</th>' : ''}</tr>
        ${data.radarDimensions.map((d, i) => `<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 12px;">${d.axis}</td><td style="text-align:center;padding:8px 12px;">${d.score} / 5</td>${data.targetRadarDimensions ? `<td style="text-align:center;padding:8px 12px;">${data.targetRadarDimensions[i]?.score ?? '-'} / 5</td>` : ''}</tr>`).join('')}
      </table>

      ${sectionTitle('三、領航員分析職類')}
      <div style="background:#fbf1e8;padding:16px 20px;border-radius:10px;margin-bottom:14px;">
        <p style="margin:0 0 6px;color:#675143;font-size:12px;letter-spacing:0.3px;">領航員分析您適合的職類</p>
        <p style="margin:0;font-size:20px;font-weight:700;color:#8d4903;letter-spacing:0.5px;">${data.targetRole} <span style="font-size:14px;margin-left:12px;">匹配度 ${data.matchScore}%</span></p>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:14px;">
        <div style="flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:8px;"><p style="margin:0 0 4px;color:#675143;font-size:12px;">自評等級</p><p style="margin:0;font-size:16px;font-weight:700;">${data.selfAssessment}</p></div>
        <div style="flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:8px;"><p style="margin:0 0 4px;color:#675143;font-size:12px;">實際等級</p><p style="margin:0;font-size:16px;font-weight:700;color:#8d4903;">${data.actualLevel}</p></div>
      </div>
      <div style="background:#FFFBF5;padding:14px 18px;border-radius:8px;">
        <p style="margin:0 0 6px;font-weight:600;">認知偏差分析</p>
        <p style="margin:0;font-size:13px;color:#675143;line-height:1.85;">${data.cognitiveBias}</p>
      </div>

      ${sectionTitle('四、SWOT 分析')}
      ${swotBlock('優勢', '#059669', data.swot.strengths)}
      ${swotBlock('劣勢', '#d97706', data.swot.weaknesses)}
      ${swotBlock('機會', '#0284c7', data.swot.opportunities)}
      ${swotBlock('威脅', '#e11d48', data.swot.threats)}
      ${data.swot.gap ? `<div style="margin-top:16px;padding:14px 18px;border:2px solid #8d4903;border-radius:10px;background:linear-gradient(135deg,#fbf1e8,#fff);">
        <strong style="color:#8d4903;letter-spacing:0.3px;">核心落差</strong>
        <p style="margin:6px 0 0;color:#502D03;font-weight:500;line-height:1.85;">${data.swot.gap}</p>
      </div>` : ''}

      ${sectionTitle('五、職涯行動計畫')}
      <p style="margin-bottom:10px;line-height:1.85;"><strong>🔹 短期計畫：</strong>${data.actionPlan.short_term}</p>
      <p style="margin-bottom:10px;line-height:1.85;"><strong>🔸 中期計畫：</strong>${data.actionPlan.mid_term}</p>
      <p style="margin-bottom:10px;line-height:1.85;"><strong>🔹 長期計畫：</strong>${data.actionPlan.long_term}</p>
    </div>
  `;
}

/** 學習資源推薦報告 */
export function buildLearningResourcesReportHtml(data: {
  overallStrategy?: string;
  milestones?: string[];
  learningResources: { title: string; description: string; tags?: string[]; rating?: number; review_count?: number; level?: string; course_type?: string; duration?: string; priority?: number; strategy_reason?: string; link?: string }[];
}): string {
  const starRating = (rating: number) => {
    const full = Math.floor(rating);
    const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
    return `<span style="color:#d97706;letter-spacing:1px;">${stars}</span> <span style="font-size:12px;color:#888;">${rating}</span>`;
  };

  const resourceCards = data.learningResources.map((r) => {
    const metaParts: string[] = [];
    if (r.rating != null) metaParts.push(starRating(r.rating));
    if (r.review_count != null) metaParts.push(`${r.review_count.toLocaleString()} 則評論`);
    if (r.course_type) metaParts.push(r.course_type);
    if (r.duration) metaParts.push(`⏱ ${r.duration}`);
    if (r.level) metaParts.push(r.level);

    return `<div style="border:1px solid #e5e0db;border-radius:10px;padding:18px;margin-bottom:14px;page-break-inside:avoid;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        ${r.priority != null ? `<span style="background:#8d4903;color:#fff;padding:3px 12px;border-radius:12px;font-size:11px;font-weight:600;letter-spacing:0.3px;">優先 ${r.priority}</span>` : '<span></span>'}
        ${r.level ? `<span style="border:1px solid #ccc;padding:3px 10px;border-radius:12px;font-size:11px;color:#666;">${r.level}</span>` : ''}
      </div>
      <h3 style="font-size:15px;margin:0 0 8px;color:#1F3A5F;letter-spacing:0.3px;">${r.title}</h3>
      <div style="font-size:11px;color:#888;margin-bottom:8px;">${metaParts.join(' · ')}</div>
      <p style="font-size:13px;margin:0 0 10px;color:#444;line-height:1.85;">${r.description}</p>
      ${r.strategy_reason ? `<div style="background:#fbf1e8;padding:10px 14px;border-radius:8px;margin-bottom:10px;">
        <p style="margin:0;font-size:12px;color:#502D03;line-height:1.8;"><strong>策略原因：</strong>${r.strategy_reason}</p>
      </div>` : ''}
      ${r.tags && r.tags.length > 0 ? `<div style="margin-top:6px;">${r.tags.map(t => `<span style="display:inline-block;background:#f0ebe5;color:#675143;padding:3px 10px;border-radius:10px;font-size:11px;margin-right:5px;">${t}</span>`).join('')}</div>` : ''}
    </div>`;
  }).join('');

  return `
    <div>
      ${h('h1', 'font-size:24px;text-align:center;color:#1F3A5F;margin-bottom:6px;letter-spacing:1px;', '學習資源推薦報告')}
      ${h('p', 'text-align:center;color:#999;font-size:12px;margin-bottom:32px;', `生成日期：${new Date().toLocaleDateString('zh-TW')}`)}

      ${data.overallStrategy ? `
        ${sectionTitle('整體策略')}
        <div style="border-left:4px solid #8d4903;background:linear-gradient(135deg,#fbf1e8,#fff);padding:16px 20px;border-radius:0 10px 10px 0;margin-bottom:20px;">
          <p style="margin:0;font-size:13px;color:#502D03;line-height:1.85;">${data.overallStrategy}</p>
        </div>
      ` : ''}

      ${sectionTitle('學習路徑')}
      ${resourceCards}

      ${data.milestones && data.milestones.length > 0 ? `
        ${sectionTitle('關鍵里程碑')}
        <div style="padding:14px 18px;border:1px solid #e5e0db;border-radius:8px;background:#fafaf8;">
          <ul style="padding-left:18px;margin:0;">${data.milestones.map(m => `<li style="margin-bottom:6px;font-size:13px;color:#444;">${m}</li>`).join('')}</ul>
        </div>
      ` : ''}
    </div>
  `;
}

/** 我的履歷 (plain text content → PDF) */
export function buildResumeContentHtml(name: string, content: string): string {
  return `
    <div>
      ${h('h1', 'font-size:22px;text-align:center;color:#1F3A5F;margin-bottom:24px;', name)}
      <pre style="white-space:pre-wrap;font-family:'Noto Sans TC',sans-serif;font-size:13px;line-height:1.8;">${content}</pre>
    </div>
  `;
}

/** 職涯分析結果報告 */
export function buildCareerAnalysisHtml(analysis: {
  title: string;
  date: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}): string {
  return `
    <div>
      ${h('h1', 'font-size:22px;text-align:center;color:#1F3A5F;margin-bottom:4px;', analysis.title)}
      ${h('p', 'text-align:center;color:#888;font-size:12px;margin-bottom:24px;', `分析日期：${analysis.date}`)}

      ${sectionTitle('分析摘要')}
      <p>${analysis.summary}</p>

      ${sectionTitle('優勢亮點')}
      ${bulletList(analysis.strengths)}

      ${sectionTitle('待加強項目')}
      ${bulletList(analysis.improvements)}

      ${sectionTitle('發展建議')}
      ${bulletList(analysis.recommendations)}
    </div>
  `;
}
