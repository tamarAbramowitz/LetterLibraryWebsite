import { useLocale } from '../../i18n/LocaleContext';
import './Footer.css';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">
          {t('logo')} — {t('footer.tagline')}
        </p>
        <p className="footer__copy">{t('footer.poweredBy')}</p>
      </div>
    </footer>
  );
}
