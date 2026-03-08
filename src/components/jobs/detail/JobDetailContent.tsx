import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecommendedJobDetail } from '@/types/job';
import { cleanDimensionText } from '@/utils/textCleaner';

interface Props {
  job: RecommendedJobDetail;
}

/**
 * Split a raw text blob into paragraphs.
 * Strategy: prefer newline splitting; if only a single block remains, fall back to
 * splitting on sentence-ending punctuation (。！？) so dense API text still reads well.
 */
function splitIntoParagraphs(raw: string): string[] {
  // 1. Try splitting by newlines (single or double)
  const byNewline = raw
    .split(/\n{1,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (byNewline.length > 1) return byNewline;

  // 2. Fallback: split on sentence-ending punctuation, keeping the punctuation
  const bySentence = raw
    .split(/(?<=[。！？])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Group every 2-3 sentences into one paragraph to avoid too many tiny blocks
  const grouped: string[] = [];
  for (let i = 0; i < bySentence.length; i += 2) {
    grouped.push(bySentence.slice(i, i + 2).join(''));
  }

  return grouped.length > 0 ? grouped : [raw];
}

const JobDetailContent = ({ job }: Props) => {
  const description = cleanDimensionText(job.job_description);
  const paragraphs = splitIntoParagraphs(description);

  return (
    <>
      {/* Job Description */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">職缺描述</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-muted-foreground leading-[1.85] tracking-wide text-sm">
              {para}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">條件要求</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{cleanDimensionText(req)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default JobDetailContent;
