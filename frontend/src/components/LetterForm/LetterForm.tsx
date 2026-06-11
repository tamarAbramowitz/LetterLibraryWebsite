import { CATEGORY_SUGGESTIONS_EN, translateCategory } from '../../i18n/categories';
import { useLocale } from '../../i18n/LocaleContext';
import type { LetterFormData, LetterFormErrors } from '../../types/generate';
import { GENDERS, TONES } from '../../types/generate';
import './LetterForm.css';

interface LetterFormProps {
  data: LetterFormData;
  errors: LetterFormErrors;
  disabled?: boolean;
  onChange: (field: keyof LetterFormData, value: string) => void;
  onSubmit: () => void;
}

export function LetterForm({ data, errors, disabled, onChange, onSubmit }: LetterFormProps) {
  const { locale, t } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="letter-form" onSubmit={handleSubmit} noValidate>
      <div className="letter-form__field">
        <label htmlFor="title" className="letter-form__label">{t('form.titleLabel')}</label>
        <input
          id="title"
          type="text"
          className={`letter-form__input ${errors.title ? 'letter-form__input--error' : ''}`}
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder={t('form.titlePlaceholder')}
          disabled={disabled}
        />
        {errors.title && <span className="letter-form__error">{errors.title}</span>}
      </div>

      <div className="letter-form__field">
        <label htmlFor="category" className="letter-form__label">{t('form.categoryLabel')}</label>
        <input
          id="category"
          type="text"
          list="category-suggestions"
          className={`letter-form__input ${errors.category ? 'letter-form__input--error' : ''}`}
          value={data.category}
          onChange={(e) => onChange('category', e.target.value)}
          placeholder={t('form.categoryPlaceholder')}
          disabled={disabled}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS_EN.map((cat) => (
            <option key={cat} value={locale === 'he' ? translateCategory(cat, 'he') : cat} />
          ))}
        </datalist>
        {errors.category && <span className="letter-form__error">{errors.category}</span>}
      </div>

      <div className="letter-form__field">
        <label htmlFor="description" className="letter-form__label">{t('form.descriptionLabel')}</label>
        <textarea
          id="description"
          className={`letter-form__textarea ${errors.description ? 'letter-form__input--error' : ''}`}
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={t('form.descriptionPlaceholder')}
          rows={4}
          disabled={disabled}
        />
        {errors.description && <span className="letter-form__error">{errors.description}</span>}
      </div>

      <div className="letter-form__field">
        <span className="letter-form__label">{t('form.genderLabel')}</span>
        <div className="letter-form__options" role="radiogroup" aria-label={t('form.genderAria')}>
          {GENDERS.map((gender) => (
            <button
              key={gender}
              type="button"
              role="radio"
              aria-checked={data.gender === gender}
              className={`letter-form__option ${data.gender === gender ? 'letter-form__option--active' : ''}`}
              onClick={() => onChange('gender', gender)}
              disabled={disabled}
            >
              {t(`genders.${gender}`)}
            </button>
          ))}
        </div>
        {errors.gender && <span className="letter-form__error">{errors.gender}</span>}
      </div>

      <div className="letter-form__field">
        <span className="letter-form__label">{t('form.toneLabel')}</span>
        <div className="letter-form__options" role="radiogroup" aria-label={t('form.toneAria')}>
          {TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              role="radio"
              aria-checked={data.tone === tone}
              className={`letter-form__option ${data.tone === tone ? 'letter-form__option--active' : ''}`}
              onClick={() => onChange('tone', tone)}
              disabled={disabled}
            >
              {t(`tones.${tone}`)}
            </button>
          ))}
        </div>
        {errors.tone && <span className="letter-form__error">{errors.tone}</span>}
      </div>

      <button type="submit" className="letter-form__submit" disabled={disabled}>
        {disabled ? t('form.generating') : t('form.submit')}
      </button>
    </form>
  );
}
