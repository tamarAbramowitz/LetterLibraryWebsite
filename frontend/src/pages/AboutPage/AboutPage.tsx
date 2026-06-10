import { useLocale } from '../../i18n/LocaleContext';
import './AboutPage.css';

export function AboutPage() {
  const { t, translations } = useLocale();

  return (
    <div className="about-page">
      <section className="about-page__hero">
        <h1 className="about-page__title">{t('about.title')}</h1>
        <p className="about-page__lead">{t('about.lead')}</p>
      </section>

      <section className="about-page__section">
        <h2>{t('about.missionTitle')}</h2>
        <p>{t('about.missionText')}</p>
      </section>

      <section className="about-page__section">
        <h2>{t('about.howTitle')}</h2>
        <div className="about-page__steps">
          <div className="about-page__step">
            <span className="about-page__step-number">1</span>
            <h3>{t('about.step1Title')}</h3>
            <p>{t('about.step1Text')}</p>
          </div>
          <div className="about-page__step">
            <span className="about-page__step-number">2</span>
            <h3>{t('about.step2Title')}</h3>
            <p>{t('about.step2Text')}</p>
          </div>
          <div className="about-page__step">
            <span className="about-page__step-number">3</span>
            <h3>{t('about.step3Title')}</h3>
            <p>{t('about.step3Text')}</p>
          </div>
        </div>
      </section>

      <section className="about-page__section">
        <h2>{t('about.featuresTitle')}</h2>
        <ul className="about-page__features">
          {translations.about.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
