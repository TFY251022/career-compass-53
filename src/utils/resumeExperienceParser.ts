import type { ResumeItem } from '@/types/resume';

export interface ParsedExperience {
  title: string;
  company: string;
  period: string;
  duties: string[];
}

/**
 * Parse work experiences from a resume item.
 * Supports both structured (optimizedData) and plain-text (content) formats.
 */
export function parseExperiencesFromResume(resume: ResumeItem): ParsedExperience[] {
  const raw = resume.optimizedData?.professional_experience || resume.content;
  if (!raw) return [];
  return parseExperienceText(raw);
}

/**
 * Parse experience text in the format:
 *   Company | Title | Period
 *   - duty 1
 *   - duty 2
 */
function parseExperienceText(text: string): ParsedExperience[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const results: ParsedExperience[] = [];
  let current: ParsedExperience | null = null;

  for (const line of lines) {
    // Match header lines like "Company | Title | Period"
    const pipeCount = (line.match(/\|/g) || []).length;
    const isDuty = /^[•\-]/.test(line);

    if (pipeCount >= 2 && !isDuty) {
      if (current) results.push(current);
      const parts = line.split('|').map((s) => s.trim());
      current = {
        company: parts[0],
        title: parts[1],
        period: parts[2],
        duties: [],
      };
      continue;
    }

    // Match duty lines
    const dutyMatch = line.match(/^[•\-]\s*(.+)/);
    if (dutyMatch && current) {
      const duty = dutyMatch[1]
        .replace(/^(?:情境|任務|行動|結果)\s*\([STAR]\)[：:]\s*/, '')
        .trim();
      if (duty) current.duties.push(duty);
    }
  }

  if (current) results.push(current);
  return results;
}
