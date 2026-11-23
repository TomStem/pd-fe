const regionalIndicator = (letter: string) => String.fromCodePoint(0x1F1E6 + letter.charCodeAt(0) - 65);
const tagCharacter = (char: string) => String.fromCodePoint(0xE0000 + char.charCodeAt(0));

/** ISO 3166-1 code ("NL") or ISO 3166-2 subdivision ("GB-SCT") to a flag emoji. */
function flagEmoji(code: string): string {
  if (!code.includes('-')) return [...code].map(regionalIndicator).join('');
  const tags = [...code.replace('-', '').toLowerCase()].map(tagCharacter).join('');
  return `${String.fromCodePoint(0x1F3F4)}${tags}${String.fromCodePoint(0xE007F)}`;
}

const codes: Record<string, string> = {
  'Scotland': 'GB-SCT',
  'England': 'GB-ENG',
  'Wales': 'GB-WLS',
  'Ireland': 'IE',
  'France': 'FR',
  'Germany': 'DE',
  'Belgium': 'BE',
  'Netherlands': 'NL',
  'United States': 'US',
  'Japan': 'JP',
  'India': 'IN',
  'Spain': 'ES',
  'Taiwan': 'TW',
  'Sweden': 'SE',
  'Australia': 'AU',
  'Canada': 'CA',
  'Finland': 'FI',
  'Denmark': 'DK',
  'Switzerland': 'CH',
  'Italy': 'IT',
  'Austria': 'AT',
  'South Africa': 'ZA',
  'New Zealand': 'NZ',
};

/** Flag for an English country name; undefined for countries we don't know. */
export const flagForCountry = (name: string): string | undefined => (codes[name] ? flagEmoji(codes[name]) : undefined);
