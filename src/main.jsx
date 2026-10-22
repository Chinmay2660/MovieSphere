import ReactDOM from 'react-dom/client';
import './index.css';
import { LocaleProvider } from './context/LocaleContext';
import { store } from './reduxStore/store';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes.jsx';
import { getStoredLanguage } from './lib/languages';
import { setRequestLanguage } from './lib/locale';
import { ensureConfiguration } from './lib/fetchConfiguration';
import { resumeInterruptedDownloads } from './lib/downloadResume';

document.documentElement.lang = getStoredLanguage();
setRequestLanguage(getStoredLanguage());
ensureConfiguration(store.dispatch, store.getState().movieData.imageURL);
resumeInterruptedDownloads(store.dispatch, store.getState().downloads);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </Provider>
  </>,
);
