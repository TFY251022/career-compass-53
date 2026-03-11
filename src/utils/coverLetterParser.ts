/**
 * Parse a cover letter content string into structured parts.
 * The content may contain the signature block starting with "此致，".
 */
export interface ParsedCoverLetter {
  bodyParagraphs: string[];
  author?: string;
  email?: string;
  portfolio?: string;
}

export function parseCoverLetterContent(content: string): ParsedCoverLetter {
  if (!content) return { bodyParagraphs: [] };

  // Extract signature block: "此致，Name email url"
  const sigPattern = /此致，(.+)$/;
  const sigMatch = content.match(sigPattern);

  let bodyText = content;
  let author: string | undefined;
  let email: string | undefined;
  let portfolio: string | undefined;

  if (sigMatch) {
    bodyText = content.slice(0, sigMatch.index).trim();
    const sigParts = sigMatch[1].trim().split(/\s+/);

    // First part is author name
    author = sigParts[0];

    // Find email and portfolio from remaining parts
    for (let i = 1; i < sigParts.length; i++) {
      const part = sigParts[i];
      if (part.includes('@')) {
        email = part;
      } else if (part.startsWith('http')) {
        portfolio = part;
      }
    }
  }

  // Split body into paragraphs using sentence-ending punctuation
  const bodyParagraphs = bodyText
    .split(/(?<=[。！？])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Group every 2-3 sentences into a paragraph for readability
  const grouped: string[] = [];
  const SENTENCES_PER_PARA = 2;
  for (let i = 0; i < bodyParagraphs.length; i += SENTENCES_PER_PARA) {
    grouped.push(bodyParagraphs.slice(i, i + SENTENCES_PER_PARA).join(''));
  }

  return { bodyParagraphs: grouped, author, email, portfolio };
}
