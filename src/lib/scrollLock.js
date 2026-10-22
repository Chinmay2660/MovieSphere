/** Ref-counted body scroll lock for overlays (filters, video, modals). */
let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function scrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function lockBodyScroll() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;
    const gap = scrollbarWidth();
    document.body.style.overflow = 'hidden';
    if (gap > 0) {
      document.body.style.paddingRight = `${gap}px`;
    }
  }
  lockCount += 1;
  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    }
  };
}
