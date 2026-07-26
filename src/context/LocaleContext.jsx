import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { translate } from '../i18n/translations';
import { clearApiCache } from '../lib/apiCache';
import { ensureConfiguration, resetConfigurationFetch } from '../lib/fetchConfiguration';
import { getStoredLanguage, LANGUAGE_STORAGE_KEY } from '../lib/languages';
import { setRequestLanguage } from '../lib/locale';
import { resetMovieData } from '../reduxStore/Reducer/movieSlice';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const dispatch = useDispatch();
  const [language, setLanguageState] = useState(getStoredLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    if (nextLanguage === language) return;

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setRequestLanguage(nextLanguage);
    clearApiCache();
    resetConfigurationFetch();
    dispatch(resetMovieData());
    ensureConfiguration(dispatch, '');
    setLanguageState(nextLanguage);
    document.documentElement.lang = nextLanguage;
  }, [dispatch, language]);

  const t = useCallback(
    (key, vars) => translate(language, key, vars),
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}
