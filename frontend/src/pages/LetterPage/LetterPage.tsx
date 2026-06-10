import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLetter } from '../../api/letters';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { LetterIllustration } from '../../components/LetterIllustration/LetterIllustration';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ReadingProgress } from '../../components/ReadingProgress/ReadingProgress';
import { useFavorites } from '../../hooks/useFavorites';
import { useLocale } from '../../i18n/LocaleContext';
import type { Letter } from '../../types/letter';
import { calculateReadingTime } from '../../utils/readingTime';
import './LetterPage.css';

export function LetterPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t } = useLocale();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  const loadLetter = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLetter(Number(id), locale);
      setLetter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('letterPage.loadError'));
    } finally {
      setLoading(false);
    }
  }, [id, locale, t]);

  useEffect(() => {
    loadLetter();
    window.scrollTo(0, 0);
  }, [loadLetter]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: letter?.title || t('letterPage.shareTitle'),
      text: letter?.description || t('letterPage.shareText'),
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage(t('letterPage.linkCopied'));
        setTimeout(() => setShareMessage(''), 2500);
      }
    } catch {
      /* user cancelled share */
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadLetter} />;
  if (!letter) return null;

  const readingTime = calculateReadingTime(letter.content);
  const paragraphs = letter.content.split('\n\n');

  return (
    <article className="letter-page">
      <ReadingProgress />

      <div className="letter-page__actions">
        <Link to="/" className="letter-page__back">
          {t('letterPage.back')}
        </Link>
        <div className="letter-page__action-buttons">
          <button
            className={`letter-page__favorite ${isFavorite(letter.id) ? 'letter-page__favorite--active' : ''}`}
            onClick={() => toggleFavorite(letter.id)}
            aria-label={isFavorite(letter.id) ? t('letterPage.removeFavorite') : t('letterPage.addFavorite')}
          >
            <svg viewBox="0 0 24 24" fill={isFavorite(letter.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className="letter-page__share" onClick={handleShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            {t('letterPage.share')}
          </button>
        </div>
      </div>

      {shareMessage && <p className="letter-page__share-toast">{shareMessage}</p>}

      <header className="letter-page__header">
        <span className="letter-page__category">{letter.category}</span>
        <h1 className="letter-page__title">{letter.title}</h1>
        <p className="letter-page__meta">{t('letterPage.minRead', { minutes: readingTime })}</p>
      </header>

      <div className="letter-page__illustration">
        <LetterIllustration variant={letter.image} />
      </div>

      <div className="letter-page__content">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
