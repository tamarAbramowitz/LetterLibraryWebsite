import { Link } from 'react-router-dom';
import { useLocale } from '../../i18n/LocaleContext';
import type { Letter } from '../../types/letter';
import { LetterIllustration } from '../LetterIllustration/LetterIllustration';
import './LetterCard.css';

interface LetterCardProps {
  letter: Letter;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export function LetterCard({ letter, isFavorite, onToggleFavorite }: LetterCardProps) {
  const { t } = useLocale();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(letter.id);
  };

  return (
    <Link to={`/letter/${letter.id}`} className="letter-card">
      <div className="letter-card__image">
        <LetterIllustration variant={letter.image} />
        <button
          className={`letter-card__favorite ${isFavorite ? 'letter-card__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? t('letterCard.removeFavorite') : t('letterCard.addFavorite')}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="letter-card__body">
        <span className="letter-card__category">{letter.category}</span>
        <h3 className="letter-card__title">{letter.title}</h3>
        <p className="letter-card__description">{letter.description}</p>
      </div>
      <div className="letter-card__footer">
        <span className="letter-card__read">{t('letterCard.read')}</span>
      </div>
    </Link>
  );
}
