import { useLocale } from '../../i18n/LocaleContext';
import './LanguageToggle.css';

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLocale();
  const isHebrew = locale === 'he';

  return (
    <button
      className="language-toggle"
      onClick={toggleLocale}
      aria-label={isHebrew ? t('language.switchToEnglish') : t('language.switchToHebrew')}
      title={isHebrew ? t('language.switchToEnglish') : t('language.switchToHebrew')}
    >
      {isHebrew ? 'EN' : 'עב'}
    </button>
  );
}
