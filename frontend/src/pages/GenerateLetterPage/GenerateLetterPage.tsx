import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateLetter } from '../../api/generate';
import { invalidateLettersCache } from '../../api/letters';
import { GeneratedLetterPreview } from '../../components/GeneratedLetterPreview/GeneratedLetterPreview';
import { LetterForm } from '../../components/LetterForm/LetterForm';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { useGeneratedLetters } from '../../hooks/useGeneratedLetters';
import type { LetterFormData, LetterFormErrors } from '../../types/generate';
import type { Letter } from '../../types/letter';
import { hasFormErrors, validateLetterForm } from '../../utils/validateLetterForm';
import './GenerateLetterPage.css';

const INITIAL_FORM: LetterFormData = {
  title: '',
  category: '',
  description: '',
  tone: 'Friendly',
};

export function GenerateLetterPage() {
  const navigate = useNavigate();
  const { saveLetter } = useGeneratedLetters();
  const [form, setForm] = useState<LetterFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<LetterFormErrors>({});
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Letter | null>(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof LetterFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'tone' ? (value as LetterFormData['tone']) : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const handleGenerate = async () => {
    const validation = validateLetterForm(form);
    setErrors(validation);
    if (hasFormErrors(validation)) return;

    setGenerating(true);
    setApiError(null);
    setGenerated(null);
    setSaved(false);

    try {
      const result = await generateLetter(form);
      const persisted = saveLetter(result.letter);
      invalidateLettersCache();
      setGenerated(persisted);
      setSaved(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to generate letter');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generated) return;
    setSaving(true);
    const savedLetter = saveLetter(generated);
    invalidateLettersCache();
    setGenerated(savedLetter);
    setSaved(true);
    setSaving(false);
  };

  const handleView = () => {
    if (generated) navigate(`/letter/${generated.id}`);
  };

  const handleBrowseLibrary = () => {
    navigate('/');
  };

  return (
    <div className="generate-page">
      <div className="generate-page__header">
        <Link to="/" className="generate-page__back">← Back to Library</Link>
        <h1 className="generate-page__title">Create New Letter</h1>
        <p className="generate-page__subtitle">
          Describe your letter and let AI craft a warm, personal message for you.
        </p>
      </div>

      <div className="generate-page__layout">
        <section className="generate-page__form-section">
          <h2 className="generate-page__section-title">Letter Details</h2>
          <LetterForm
            data={form}
            errors={errors}
            disabled={generating}
            onChange={handleChange}
            onSubmit={handleGenerate}
          />
          {apiError && (
            <div className="generate-page__error" role="alert">{apiError}</div>
          )}
        </section>

        <section className="generate-page__preview-section">
          <h2 className="generate-page__section-title">Preview</h2>
          {generating && (
            <div className="generate-page__loading">
              <LoadingSpinner />
              <p>Crafting your letter...</p>
            </div>
          )}
          {!generating && !generated && (
            <div className="generate-page__placeholder">
              <span className="generate-page__placeholder-icon">✉</span>
              <p>Fill in the form and click Generate Letter to see your creation here.</p>
            </div>
          )}
          {!generating && generated && (
            <GeneratedLetterPreview
              letter={generated}
              saved={saved}
              onSave={handleSave}
              onView={handleView}
              onBrowseLibrary={handleBrowseLibrary}
              saving={saving}
            />
          )}
        </section>
      </div>
    </div>
  );
}
