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
  const paragraphs = letter.content.split('\n\n');

  return (
    <div className="generated-preview generated-preview--visible">
      <div className="generated-preview__header">
        <span className="generated-preview__badge">✨ Generated</span>
        {saved && <span className="generated-preview__saved">Saved to Library</span>}
      </div>

      <div className="generated-preview__illustration">
        <LetterIllustration variant={letter.image} />
      </div>

      <h2 className="generated-preview__title">{letter.title}</h2>
      <p className="generated-preview__meta">{letter.category}</p>

      <div className="generated-preview__content">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="generated-preview__actions">
        {!saved && (
          <button
            className="generated-preview__btn generated-preview__btn--primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Letter'}
          </button>
        )}
        {saved && (
          <>
            <button
              className="generated-preview__btn generated-preview__btn--primary"
              onClick={onView}
            >
              View Letter
            </button>
            <button
              className="generated-preview__btn generated-preview__btn--secondary"
              onClick={onBrowseLibrary}
            >
              Browse Library
            </button>
          </>
        )}
      </div>
    </div>
  );
}
