import { useState } from 'react';
import { verifyAdminPassword } from '../../api/admin';
import { useLocale } from '../../i18n/LocaleContext';
import './AdminLoginModal.css';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ onClose, onSuccess }: AdminLoginModalProps) {
  const { t } = useLocale();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyAdminPassword(password);
      sessionStorage.setItem('letter-library-admin-password', password);
      onSuccess();
    } catch {
      setError(t('admin.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal__backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        role="dialog"
        aria-labelledby="admin-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="admin-modal-title" className="admin-modal__title">{t('admin.loginTitle')}</h2>
        <p className="admin-modal__subtitle">{t('admin.loginSubtitle')}</p>

        <form onSubmit={handleSubmit} className="admin-modal__form">
          <label htmlFor="admin-password" className="admin-modal__label">
            {t('admin.passwordLabel')}
          </label>
          <input
            id="admin-password"
            type="password"
            className="admin-modal__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('admin.passwordPlaceholder')}
            autoFocus
            disabled={loading}
          />
          {error && <p className="admin-modal__error" role="alert">{error}</p>}

          <div className="admin-modal__actions">
            <button type="button" className="admin-modal__btn admin-modal__btn--secondary" onClick={onClose}>
              {t('admin.cancel')}
            </button>
            <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={loading || !password}>
              {loading ? t('admin.loggingIn') : t('admin.login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
