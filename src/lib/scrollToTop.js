/** Reset document scroll after route changes (single vertical scroller). */
export function scrollAppToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
}
