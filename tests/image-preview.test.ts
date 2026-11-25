import { describe, expect, it } from 'vitest';
import { PREVIEW_MODIFIERS, previewBackground } from '../app/utils/imagePreview';

describe('previewBackground', () => {
  it('wraps a url for css', () => {
    expect(previewBackground('/_ipx/w_28/a.jpg')).toBe('url("/_ipx/w_28/a.jpg")');
  });

  it('escapes quotes and parentheses', () => {
    expect(previewBackground('/a"b(c).jpg')).toBe('url("/a\\"b\\(c\\).jpg")');
  });

  it('has nothing without url', () => {
    expect(previewBackground(undefined)).toBeUndefined();
  });

  it('asks for a tiny webp', () => {
    expect(PREVIEW_MODIFIERS.width).toBeLessThanOrEqual(32);
    expect(PREVIEW_MODIFIERS.format).toBe('webp');
  });
});
