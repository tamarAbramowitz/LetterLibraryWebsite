import type { LetterFormData, LetterFormErrors, Tone } from '../../types/generate';
import { TONES } from '../../types/generate';
import './LetterForm.css';

interface LetterFormProps {
  data: LetterFormData;
  errors: LetterFormErrors;
  disabled?: boolean;
  onChange: (field: keyof LetterFormData, value: string) => void;
  onSubmit: () => void;
}

const CATEGORY_SUGGESTIONS = [
  'Appreciation', 'Congratulations', 'Encouragement', 'Friendship',
  'Thank You', 'Memory', 'Inspiration', 'New Beginning',
];

export function LetterForm({ data, errors, disabled, onChange, onSubmit }: LetterFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="letter-form" onSubmit={handleSubmit} noValidate>
      <div className="letter-form__field">
        <label htmlFor="title" className="letter-form__label">Letter Title</label>
        <input
          id="title"
          type="text"
          className={`letter-form__input ${errors.title ? 'letter-form__input--error' : ''}`}
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g., A Thank You for Your Kindness"
          disabled={disabled}
        />
        {errors.title && <span className="letter-form__error">{errors.title}</span>}
      </div>

      <div className="letter-form__field">
        <label htmlFor="category" className="letter-form__label">Letter Category</label>
        <input
          id="category"
          type="text"
          list="category-suggestions"
          className={`letter-form__input ${errors.category ? 'letter-form__input--error' : ''}`}
          value={data.category}
          onChange={(e) => onChange('category', e.target.value)}
          placeholder="e.g., Appreciation"
          disabled={disabled}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        {errors.category && <span className="letter-form__error">{errors.category}</span>}
      </div>

      <div className="letter-form__field">
        <label htmlFor="description" className="letter-form__label">Description</label>
        <textarea
          id="description"
          className={`letter-form__textarea ${errors.description ? 'letter-form__input--error' : ''}`}
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe what the letter should be about, who it is for, and what you want to express..."
          rows={4}
          disabled={disabled}
        />
        {errors.description && <span className="letter-form__error">{errors.description}</span>}
      </div>

      <div className="letter-form__field">
        <span className="letter-form__label">Tone</span>
        <div className="letter-form__tones" role="radiogroup" aria-label="Letter tone">
          {TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              role="radio"
              aria-checked={data.tone === tone}
              className={`letter-form__tone ${data.tone === tone ? 'letter-form__tone--active' : ''}`}
              onClick={() => onChange('tone', tone)}
              disabled={disabled}
            >
              {tone}
            </button>
          ))}
        </div>
        {errors.tone && <span className="letter-form__error">{errors.tone}</span>}
      </div>

      <button type="submit" className="letter-form__submit" disabled={disabled}>
        {disabled ? 'Generating...' : 'Generate Letter'}
      </button>
    </form>
  );
}
