const palettes = {
  islay: ['#1e2a2e', '#3c5560', '#c98a3b'],
  speyside: ['#3a2410', '#a8651c', '#e6b565'],
  japan: ['#3a1218', '#a63a45', '#f0c9b6'],
  ireland: ['#12301f', '#3c7a4f', '#d9c27a'],
  highlands: ['#1f2433', '#4a5d7a', '#c9b27a'],
  kentucky: ['#2a1710', '#8a3f1e', '#e3a45b'],
} as const;

type Palette = keyof typeof palettes;

const paletteBySlug: Record<string, Palette> = {
  'islay': 'islay',
  'campbeltown': 'islay',
  'speyside': 'speyside',
  'highlands': 'highlands',
  'schotland': 'highlands',
  'scotland': 'highlands',
  'noord-ierland': 'ireland',
  'munster': 'ireland',
  'ierland': 'ireland',
  'ireland': 'ireland',
  'honshu': 'japan',
  'hokkaido': 'japan',
  'japan': 'japan',
  'kentucky': 'kentucky',
  'verenigde-staten': 'kentucky',
  'united-states': 'kentucky',
};

/** Gradient for the first slug (region before country) that has a palette; amber "speyside" otherwise. */
export function placeholderGradient(...slugs: (string | undefined)[]): string {
  const slug = slugs.find(s => s && paletteBySlug[s]);
  const [dark, mid, light] = palettes[(slug && paletteBySlug[slug]) || 'speyside'];
  return `linear-gradient(135deg, ${dark}, ${mid} 60%, ${light})`;
}
