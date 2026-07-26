import { useLocale } from '../../context/LocaleContext';

const NotFound = () => {
  const { t } = useLocale();

  return (
    <div className="grid h-screen place-content-center bg-background px-4">
      <div className="text-center">
        <h1 className="gradient-text text-9xl font-black">404</h1>
        <p className="text-2xl font-bold tracking-tight text-text sm:text-4xl">Uh-oh!</p>
        <p className="mt-4 text-muted">We can&apos;t find that page.</p>
        <a
          href="/"
          className="btn-primary mt-6 inline-block px-6 py-3 text-sm"
        >
          {t('common.goBackHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
