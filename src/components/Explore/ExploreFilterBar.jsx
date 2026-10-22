import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoOptionsOutline,
  IoClose,
  IoChevronDown,
} from 'react-icons/io5';
import { useLocale } from '../../context/LocaleContext';
import {
  EXPLORE_RATING_OPTIONS,
  EXPLORE_LANGUAGE_OPTIONS,
  EXPLORE_COUNTRY_OPTIONS,
  getExploreSortOptions,
  getExploreYearOptions,
  hasNonDefaultExploreFilters,
  countActiveModalExploreFilters,
  exploreModalFiltersEqual,
} from '../../lib/exploreFilters';
import { lockBodyScroll } from '../../lib/scrollLock';

const ExploreFilterBar = ({
  isTV,
  genres,
  draftFilters,
  appliedFilters,
  onDraftChange,
  onSortChange,
  onApply,
  onClear,
  showSheet,
  onToggleSheet,
  onCloseSheet,
}) => {
  const { t } = useLocale();
  const sheetRef = useRef(null);
  const filterTriggerRef = useRef(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0, width: 352 });

  const updatePanelPosition = useCallback(() => {
    const trigger = filterTriggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(352, window.innerWidth - 16);
    const gap = 8;
    let left = rect.right - width;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    let top = rect.bottom + gap;
    const panelHeight = sheetRef.current?.offsetHeight ?? 0;
    if (panelHeight > 0 && top + panelHeight > window.innerHeight - 8) {
      top = Math.max(8, rect.top - gap - panelHeight);
    }
    setPanelPosition({ top, left, width });
  }, []);
  const yearOptions = getExploreYearOptions();
  const sortOptions = getExploreSortOptions(isTV);
  const appliedCount = countActiveModalExploreFilters(appliedFilters);
  const hasPendingModalChanges = !exploreModalFiltersEqual(draftFilters, appliedFilters);

  const commitModalDraft = () => {
    onApply({
      genres: draftFilters.genres,
      year: draftFilters.year,
      minRating: draftFilters.minRating,
      language: draftFilters.language,
      country: draftFilters.country,
    });
  };

  useEffect(() => {
    if (!showSheet) return undefined;
    return lockBodyScroll();
  }, [showSheet]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseSheet();
    };
    if (showSheet) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [showSheet, onCloseSheet]);

  useLayoutEffect(() => {
    if (!showSheet) return undefined;
    updatePanelPosition();
    const raf = requestAnimationFrame(updatePanelPosition);
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    const panel = sheetRef.current;
    const ro = panel ? new ResizeObserver(updatePanelPosition) : null;
    if (panel && ro) ro.observe(panel);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
      ro?.disconnect();
    };
  }, [showSheet, updatePanelPosition]);

  const genreSelectValue =
    draftFilters.genres.length === 1 ? draftFilters.genres[0] : '';

  const filterPortal =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {showSheet && (
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="explore-filter-backdrop"
                  onClick={onCloseSheet}
                  aria-label={t('explore.closeFilters')}
                />
                <motion.div
                  ref={sheetRef}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="explore-filter-panel explore-filter-panel-motion"
                  style={{
                    top: panelPosition.top,
                    left: panelPosition.left,
                    width: panelPosition.width,
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="explore-filter-title"
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-accent/20 px-4 py-3">
                    <h2 id="explore-filter-title" className="apple-headline text-text">
                      {t('explore.filters')}
                    </h2>
                    <button
                      type="button"
                      onClick={onCloseSheet}
                      className="rounded-full p-2 text-secondary hover:bg-white/10 hover:text-text"
                      aria-label={t('explore.closeFilters')}
                    >
                      <IoClose className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="explore-filter-panel-body space-y-4">
                    <section>
                      <label
                        htmlFor="explore-filter-genre"
                        className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted"
                      >
                        {t('explore.genres')}
                      </label>
                      <div className="relative">
                        <select
                          id="explore-filter-genre"
                          value={genreSelectValue}
                          onChange={(e) => {
                            const id = e.target.value;
                            onDraftChange({
                              ...draftFilters,
                              genres: id ? [id] : [],
                            });
                          }}
                          className="explore-control w-full appearance-none rounded-xl pr-9"
                        >
                          <option value="">{t('explore.all')}</option>
                          {genres.map((genre) => (
                            <option key={genre.id} value={genre.id.toString()}>
                              {genre.name}
                            </option>
                          ))}
                        </select>
                        <IoChevronDown
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                          aria-hidden
                        />
                      </div>
                      {draftFilters.genres.length > 1 && (
                        <p className="mt-1.5 apple-caption-1 text-muted">
                          {t('explore.genreMultiHint')}
                        </p>
                      )}
                    </section>

                    <section>
                      <label
                        htmlFor="explore-filter-year"
                        className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted"
                      >
                        {t('explore.year.label')}
                      </label>
                      <div className="relative">
                        <select
                          id="explore-filter-year"
                          value={draftFilters.year}
                          onChange={(e) =>
                            onDraftChange({ ...draftFilters, year: e.target.value })
                          }
                          className="explore-control w-full appearance-none rounded-xl pr-9"
                        >
                          {yearOptions.map((opt) => (
                            <option key={opt.value || 'any-year'} value={opt.value}>
                              {opt.labelKey ? t(opt.labelKey) : opt.label}
                            </option>
                          ))}
                        </select>
                        <IoChevronDown
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                          aria-hidden
                        />
                      </div>
                    </section>

                    <section>
                      <label
                        htmlFor="explore-filter-rating"
                        className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted"
                      >
                        {t('explore.rating.label')}
                      </label>
                      <div className="relative">
                        <select
                          id="explore-filter-rating"
                          value={draftFilters.minRating}
                          onChange={(e) =>
                            onDraftChange({ ...draftFilters, minRating: e.target.value })
                          }
                          className="explore-control w-full appearance-none rounded-xl pr-9"
                        >
                          {EXPLORE_RATING_OPTIONS.map((opt) => (
                            <option key={opt.value || 'any-rating'} value={opt.value}>
                              {t(opt.labelKey)}
                            </option>
                          ))}
                        </select>
                        <IoChevronDown
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                          aria-hidden
                        />
                      </div>
                    </section>

                    <section className="border-t border-accent/15 pt-4">
                      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
                        {t('explore.advanced')}
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="explore-filter-language"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted"
                          >
                            {t('explore.language.label')}
                          </label>
                          <div className="relative">
                            <select
                              id="explore-filter-language"
                              value={draftFilters.language}
                              onChange={(e) =>
                                onDraftChange({ ...draftFilters, language: e.target.value })
                              }
                              className="explore-control w-full appearance-none rounded-xl pr-9"
                            >
                              {EXPLORE_LANGUAGE_OPTIONS.map((opt) => (
                                <option key={opt.value || 'any-language'} value={opt.value}>
                                  {t(opt.labelKey)}
                                </option>
                              ))}
                            </select>
                            <IoChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                              aria-hidden
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="explore-filter-country"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted"
                          >
                            {t('explore.country.label')}
                          </label>
                          <div className="relative">
                            <select
                              id="explore-filter-country"
                              value={draftFilters.country}
                              onChange={(e) =>
                                onDraftChange({ ...draftFilters, country: e.target.value })
                              }
                              className="explore-control w-full appearance-none rounded-xl pr-9"
                            >
                              {EXPLORE_COUNTRY_OPTIONS.map((opt) => (
                                <option key={opt.value || 'any-country'} value={opt.value}>
                                  {t(opt.labelKey)}
                                </option>
                              ))}
                            </select>
                            <IoChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                              aria-hidden
                            />
                          </div>
                          <p className="mt-1.5 apple-caption-1 text-muted">
                            {t('explore.country.hint')}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="explore-filter-panel-footer border-t border-accent/20 px-4 py-3">
                    <button
                      type="button"
                      onClick={commitModalDraft}
                      disabled={!hasPendingModalChanges}
                      className="btn-primary relative z-[1] w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('explore.applyFilters')}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div className="explore-toolbar mb-4 space-y-2 sm:mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:justify-between sm:gap-3">
        <div className="relative min-w-0 sm:max-w-[14rem] sm:flex-1">
          <label className="sr-only">{t('explore.sort.label')}</label>
          <select
            value={appliedFilters.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="explore-control w-full appearance-none pr-9"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
          <IoChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={onToggleSheet}
            className={`explore-control inline-flex min-h-[2.5rem] flex-1 items-center justify-center gap-2 sm:flex-none ${
              showSheet || appliedCount > 0 ? 'explore-control-active' : ''
            }`}
            aria-expanded={showSheet}
            aria-controls="explore-filter-title"
          >
            <IoOptionsOutline className="h-5 w-5 shrink-0" aria-hidden />
            <span className="truncate">{t('explore.filters')}</span>
            {appliedCount > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] font-bold text-primary-fg">
                {appliedCount}
              </span>
            )}
          </button>

          {hasPendingModalChanges && !showSheet && (
            <button
              type="button"
              onClick={commitModalDraft}
              className="btn-primary min-h-[2.5rem] flex-1 px-4 py-2 text-sm sm:flex-none"
            >
              {t('explore.applyFilters')}
            </button>
          )}

          {hasNonDefaultExploreFilters(appliedFilters) && (
            <button
              type="button"
              onClick={onClear}
              className="explore-text-btn inline-flex min-h-[2.5rem] items-center gap-1 px-1"
            >
              <IoClose className="h-4 w-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">{t('explore.clearAll')}</span>
            </button>
          )}
        </div>
      </div>

      {filterPortal}
    </div>
  );
};

export default ExploreFilterBar;
