/**
 * Split a raw text blob into paragraphs (hybrid mode).
 * 1. Prefer splitting by newlines (\n).
 * 2. Fallback: split on sentence-ending punctuation (。！？), one sentence per paragraph.
 */
export function splitIntoParagraphs(raw: string): string[] {
  if (!raw) return [];

  // 1. Try splitting by newlines
  const byNewline = raw
    .split(/\n{1,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (byNewline.length > 1) return byNewline;

  // 2. Fallback: split after each sentence-ending punctuation
  const bySentence = raw
    .split(/(?<=[。！？])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return bySentence.length > 1 ? bySentence : [raw];
}
