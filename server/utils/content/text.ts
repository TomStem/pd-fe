const escapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

const TEASER_LENGTH = 140;

/** "United States" → "united-states", "#11 Cask finishes" → "11-cask-finishes". */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Collapses whitespace and cuts at a word boundary; undefined for empty text. */
export function teaser(text: string): string | undefined {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (!flat) return undefined;
  if (flat.length <= TEASER_LENGTH) return flat;
  const cut = flat.slice(0, TEASER_LENGTH);
  const end = cut.lastIndexOf(' ');
  return `${(end > 0 ? cut.slice(0, end) : cut).replace(/[\s,.;:!?-]+$/, '')}…`;
}

/** Fixtures store long text as plain paragraphs separated by blank lines. */
export function plainTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(paragraph => `<p>${paragraph.replace(/[&<>"]/g, char => escapes[char]!)}</p>`)
    .join('');
}
