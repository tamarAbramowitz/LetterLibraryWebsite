import { useLocale } from '../../i18n/LocaleContext';
import type { Letter } from '../../types/letter';
import { LetterIllustration } from '../LetterIllustration/LetterIllustration';
import './GeneratedLetterPreview.css';

interface GeneratedLetterPreviewProps {
  letter: Letter;
  saved: boolean;
  onSave: () => void;
  onView: () => void;
  onBrowseLibrary: () => void;
  saving?: boolean;
}

export function GeneratedLetterPreview({
  letter,
  saved,
  onSave,
  onView,
  onBrowseLibrary,
  saving,
}: GeneratedLetterPreviewProps) {
  const { t } = useLocale();
  const paragraphs = letter.content.split('\n\n');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="generated-preview generated-preview--visible">
      <div className="generated-preview__header no-print">
        <span className="generated-preview__badge">{t('preview.badge')}</span>
        {saved && <span className="generated-preview__saved">{t('preview.saved')}</span>}
      </div>

      <div className="generated-preview__illustration no-print">
        <LetterIllustration variant={letter.image} />
      </div>

      <h2 className="generated-preview__title">{letter.title}</h2>
      <p className="generated-preview__meta">{letter.category}</p>

      <div className="generated-preview__content">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="generated-preview__actions no-print">
        <button
          className="generated-preview__btn generated-preview__btn--secondary"
          onClick={handlePrint}
          aria-label={t('preview.printAria')}
        >
          {t('preview.print')}
        </button>
        {!saved && (
          <button
            className="generated-preview__btn generated-preview__btn--primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? t('preview.saving') : t('preview.save')}
          </button>
        )}
        {saved && (
          <>
            <button
              className="generated-preview__btn generated-preview__btn--primary"
              onClick={onView}
            >
              {t('preview.view')}
            </button>
            <button
              className="generated-preview__btn generated-preview__btn--secondary"
              onClick={onBrowseLibrary}
            >
              {t('preview.browse')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
