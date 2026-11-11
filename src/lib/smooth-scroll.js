export const SMOOTH_SCROLL_ENABLED = false

export const SMOOTH_SCROLL_OPTIONS = {
  duration: 1.9,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
}
