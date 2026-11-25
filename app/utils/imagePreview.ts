/** Modifiers for the tiny image that is shown blurred while the real one loads. */
export const PREVIEW_MODIFIERS = { width: 28, quality: 40, format: 'webp' } as const;

/** CSS `background-image` value for an image URL; quotes and parentheses are escaped so any URL is safe in a style attribute. */
export const previewBackground = (url?: string): string | undefined =>
  url ? `url("${url.replace(/["\\()]/g, c => `\\${c}`)}")` : undefined;
