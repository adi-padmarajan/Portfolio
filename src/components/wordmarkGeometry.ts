// The "Adi" wordmark is drawn on a 100-unit height: the A's cap and the d's ascender reach the top,
// and the lowercase x-height sits at y = 28
export const WORDMARK_WIDTH = 190;
export const WORDMARK_HEIGHT = 100;

// The d's oval counter, as the largest circle that fits inside it (it touches both sides of the oval):
// zooming about this centre until the circle outgrows the screen guarantees the hole swallows the whole viewport
export const D_COUNTER = { x: 118, y: 64, r: 16 };
