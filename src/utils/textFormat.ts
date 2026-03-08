/**
 * Split a raw text blob into paragraphs (hybrid mode).
 * 1. Prefer splitting by newlines (\n).
 * 2. Fallback: split on sentence-ending punctuation (。！？), grouping every 2 sentences.
 */
export function splitIntoParagraphs(raw: string): string[] {
  if (!raw) return [];

  // 1. Try splitting by newlines
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

  // Group every 2 sentences into one paragraph
  const grouped: string[] = [];
  for (let i = 0; i < bySentence.length; i += 2) {
    grouped.push(bySentence.slice(i, i + 2).join(''));
  }

  return grouped.length > 0 ? grouped : [raw];
}
