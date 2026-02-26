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
  wrapper.style.color = '#222';
  wrapper.style.lineHeight = '1.7';
  wrapper.style.fontSize = '13px';
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
  h('h2', 'font-size:16px;color:#1F3A5F;border-bottom:2px solid #1F3A5F;padding-bottom:6px;margin:20px 0 10px;', text);

const bulletList = (items: string[]) =>
  `<ul style="padding-left:18px;margin:0;">${items.map(i => `<li style="margin-bottom:4px;">${i}</li>`).join('')}</ul>`;

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
  summary: string;
  templateLabel: string;
  radarData: { dimension: string; user: number; target: number }[];
  selfAssessment: string;
  aiAssessment: string;
  matchPercentage: number;
  targetPosition: string;
  cognitiveBias: string;
  assessmentExplanation: string;
  gaps: { skill: string; current: number; target: number; priority: string }[];
  learningResources: { title: string; description: string }[];
  sideProjects: { name: string; technologies: string[] }[];
}): string {
  return `
    <div>
      ${h('h1', 'font-size:22px;text-align:center;color:#1F3A5F;margin-bottom:4px;', '職能分析報告')}
      ${h('p', 'text-align:center;color:#888;font-size:12px;margin-bottom:24px;', `生成日期：${new Date().toLocaleDateString('zh-TW')}`)}

      ${sectionTitle('一、整體評估')}
      <p>${data.summary}</p>

      ${sectionTitle(`二、職能雷達圖數據（${data.templateLabel}）`)}
      ${bulletList(data.radarData.map(d => `${d.dimension}：當前 ${d.user}% ／ 目標 ${d.target}%`))}

      ${sectionTitle('三、職能差距分析')}
      ${bulletList([
        `自評職級：${data.selfAssessment}`,
        `評估職級：${data.aiAssessment}`,
        `匹配度：${data.matchPercentage}%`,
        `目標職位：${data.targetPosition}`,
      ])}
      <p><strong>認知偏差說明：</strong>${data.cognitiveBias}</p>
      <p><strong>評估說明：</strong>${data.assessmentExplanation}</p>
      ${sectionTitle('優先改善項目')}
      ${bulletList(data.gaps.map(g => `${g.skill}：當前 ${g.current}% → 目標 ${g.target}%（優先級：${g.priority}）`))}

      ${sectionTitle('四、推薦學習資源')}
      ${bulletList(data.learningResources.map(r => `${r.title}：${r.description}`))}

      ${sectionTitle('五、推薦 Side Project')}
      ${bulletList(data.sideProjects.map(p => `${p.name}（技術：${p.technologies.join('、')}）`))}
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
