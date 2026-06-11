import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteLetter, fetchLetter, isLetterOwner } from '../../api/letters';
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
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, removeFavorite } = useFavorites();

  const letterId = id ? Number(id) : null;
  const canDelete = letter !== null && isLetterOwner(letter);

  const loadLetter = useCallback(async () => {
    if (!letterId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLetter(letterId, locale);
      setLetter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('letterPage.loadError'));
    } finally {
      setLoading(false);
    }
  }, [letterId, locale, t]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!letterId || !letter || !isLetterOwner(letter)) return;
    if (!window.confirm(t('letterPage.deleteConfirm'))) return;

    setDeleteError(null);
    try {
      await deleteLetter(letterId);
      removeFavorite(letterId);
      navigate('/');
    } catch {
      setDeleteError(t('letterPage.deleteError'));
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

      <div className="letter-page__actions no-print">
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
          <button
            className="letter-page__print"
            onClick={handlePrint}
            aria-label={t('letterPage.printAria')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            {t('letterPage.print')}
          </button>
          {canDelete && (
            <button
              className="letter-page__delete"
              onClick={handleDelete}
              aria-label={t('letterPage.deleteAria')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              {t('letterPage.delete')}
            </button>
          )}
        </div>
      </div>

      {shareMessage && <p className="letter-page__share-toast no-print">{shareMessage}</p>}
      {deleteError && <p className="letter-page__error-toast no-print" role="alert">{deleteError}</p>}

      <header className="letter-page__header">
        <span className="letter-page__category">{letter.category}</span>
        <h1 className="letter-page__title">{letter.title}</h1>
        <p className="letter-page__meta">{t('letterPage.minRead', { minutes: readingTime })}</p>
      </header>

      <div className="letter-page__illustration no-print">
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
