import { IoCheckmark, IoSettingsOutline } from 'react-icons/io5';
import { useLocale } from '../context/LocaleContext';
import { APP_LANGUAGES } from '../lib/languages';

const OptionList = ({ options, value, onChange, ariaLabel }) => (
  <ul role="listbox" aria-label={ariaLabel} className="space-y-1">
    {options.map((option) => {
      const isSelected = option.code === value;
      return (
        <li key={option.code} role="option" aria-selected={isSelected}>
          <button
            type="button"
            onClick={() => onChange(option.code)}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
              isSelected
                ? 'bg-white/10 text-text'
                : 'text-secondary hover:bg-white/6 hover:text-text'
            }`}
          >
            <span className="text-sm font-medium">
              {option.nativeLabel ?? option.label}
            </span>
            {isSelected && <IoCheckmark className="shrink-0 text-accent" aria-hidden />}
          </button>
        </li>
      );
    })}
  </ul>
);

const SettingsPage = () => {
  const { language, setLanguage, t } = useLocale();

  return (
    <div className="apple-page">
      <div className="apple-container max-w-2xl py-6 sm:py-8">
        <header className="apple-section-header flex items-center gap-3">
          <IoSettingsOutline className="h-8 w-8 text-accent" aria-hidden />
          <div>
            <h1 className="apple-large-title text-text">{t('settings.title')}</h1>
            <p className="apple-subheadline mt-1">{t('settings.subtitle')}</p>
          </div>
        </header>

        {APP_LANGUAGES.length > 1 && (
          <section className="apple-content-box mb-4">
            <h2 className="apple-title-3 mb-1 text-text">{t('language.label')}</h2>
            <p className="apple-footnote mb-3 text-secondary">{t('settings.languageDesc')}</p>
            <OptionList
              options={APP_LANGUAGES}
              value={language}
              onChange={setLanguage}
              ariaLabel={t('language.select')}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
