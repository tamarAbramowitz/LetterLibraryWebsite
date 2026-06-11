import { useState } from 'react';
import { changeAdminPassword } from '../../api/admin';
import { useLocale } from '../../i18n/LocaleContext';
import { updateStoredAdminPassword } from '../../hooks/useAdmin';
import {
  hasChangePasswordErrors,
  validateChangePasswordForm,
  type ChangePasswordFormData,
  type ChangePasswordFormErrors,
} from '../../utils/validateChangePassword';
import '../AdminLoginModal/AdminLoginModal.css';

interface ChangeAdminPasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM: ChangePasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function ChangeAdminPasswordModal({ onClose, onSuccess }: ChangeAdminPasswordModalProps) {
  const { t, translations } = useLocale();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ChangePasswordFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateChangePasswordForm(form, translations.admin.changePassword.errors);
    setErrors(validation);
    if (hasChangePasswordErrors(validation)) return;

    setLoading(true);
    setApiError(null);

    try {
      await changeAdminPassword(form.currentPassword.trim(), form.newPassword.trim());
      updateStoredAdminPassword(form.newPassword.trim());
      onSuccess();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : t('admin.changePassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal__backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal admin-modal--wide"
        role="dialog"
        aria-labelledby="change-password-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="change-password-title" className="admin-modal__title">
          {t('admin.changePassword.title')}
        </h2>
        <p className="admin-modal__subtitle">{t('admin.changePassword.subtitle')}</p>

        <form onSubmit={handleSubmit} className="admin-modal__form" noValidate>
          <label htmlFor="current-password" className="admin-modal__label">
            {t('admin.changePassword.currentLabel')}
          </label>
          <input
            id="current-password"
            type="password"
            className={`admin-modal__input ${errors.currentPassword ? 'admin-modal__input--error' : ''}`}
            value={form.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            autoFocus
            disabled={loading}
          />
          {errors.currentPassword && (
            <span className="admin-modal__error">{errors.currentPassword}</span>
          )}

          <label htmlFor="new-password" className="admin-modal__label">
            {t('admin.changePassword.newLabel')}
          </label>
          <input
            id="new-password"
            type="password"
            className={`admin-modal__input ${errors.newPassword ? 'admin-modal__input--error' : ''}`}
            value={form.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            disabled={loading}
          />
          {errors.newPassword && <span className="admin-modal__error">{errors.newPassword}</span>}

          <label htmlFor="confirm-password" className="admin-modal__label">
            {t('admin.changePassword.confirmLabel')}
          </label>
          <input
            id="confirm-password"
            type="password"
            className={`admin-modal__input ${errors.confirmPassword ? 'admin-modal__input--error' : ''}`}
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <span className="admin-modal__error">{errors.confirmPassword}</span>
          )}

          {apiError && <p className="admin-modal__error" role="alert">{apiError}</p>}

          <div className="admin-modal__actions">
            <button
              type="button"
              className="admin-modal__btn admin-modal__btn--secondary"
              onClick={onClose}
              disabled={loading}
            >
              {t('admin.cancel')}
            </button>
            <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={loading}>
              {loading ? t('admin.changePassword.saving') : t('admin.changePassword.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
