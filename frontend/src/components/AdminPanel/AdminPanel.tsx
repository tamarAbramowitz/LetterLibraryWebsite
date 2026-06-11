import { useState } from 'react';
import { deleteAllLetters, deleteAllUserLetters } from '../../api/admin';
import { clearAllGeneratedLetters } from '../../api/letters';
import { canUseAdminApi } from '../../utils/staticAdmin';
import { ChangeAdminPasswordModal } from '../ChangeAdminPasswordModal/ChangeAdminPasswordModal';
import { useLocale } from '../../i18n/LocaleContext';
import './AdminPanel.css';

interface AdminPanelProps {
  onLogout: () => void;
  onLettersChanged: () => void;
}

export function AdminPanel({ onLogout, onLettersChanged }: AdminPanelProps) {
  const { t } = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<'all' | 'users' | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const adminApiAvailable = canUseAdminApi();

  const handleDeleteAll = async () => {
    if (!window.confirm(t('admin.deleteAllConfirm'))) return;
    setError(null);
    setLoading('all');
    try {
      await deleteAllLetters();
      clearAllGeneratedLetters();
      onLettersChanged();
    } catch (err) {
      setError(err instanceof Error && err.message === 'ADMIN_API_UNAVAILABLE'
        ? t('admin.staticModeApiError')
        : t('admin.deleteAllError'));
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteUserLetters = async () => {
    if (!window.confirm(t('admin.deleteUsersConfirm'))) return;
    setError(null);
    setLoading('users');
    try {
      await deleteAllUserLetters();
      clearAllGeneratedLetters();
      onLettersChanged();
    } catch (err) {
      setError(err instanceof Error && err.message === 'ADMIN_API_UNAVAILABLE'
        ? t('admin.staticModeApiError')
        : t('admin.deleteUsersError'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="admin-panel" aria-label={t('admin.panelAria')}>
      <div className="admin-panel__header">
        <span className="admin-panel__badge">{t('admin.active')}</span>
        <button type="button" className="admin-panel__logout" onClick={onLogout}>
          {t('admin.logout')}
        </button>
      </div>

      <p className="admin-panel__hint">{t('admin.panelHint')}</p>
      {!adminApiAvailable && (
        <p className="admin-panel__notice">{t('admin.staticModeNotice')}</p>
      )}

      <div className="admin-panel__actions">
        {adminApiAvailable && (
          <button
            type="button"
            className="admin-panel__btn admin-panel__btn--secondary"
            onClick={() => setShowChangePassword(true)}
            disabled={loading !== null}
          >
            {t('admin.changePassword.btn')}
          </button>
        )}
        <button
          type="button"
          className="admin-panel__btn admin-panel__btn--danger"
          onClick={handleDeleteUserLetters}
          disabled={loading !== null || !adminApiAvailable}
          title={!adminApiAvailable ? t('admin.staticModeApiError') : undefined}
        >
          {loading === 'users' ? t('admin.deleting') : t('admin.deleteUsers')}
        </button>
        <button
          type="button"
          className="admin-panel__btn admin-panel__btn--danger-outline"
          onClick={handleDeleteAll}
          disabled={loading !== null || !adminApiAvailable}
          title={!adminApiAvailable ? t('admin.staticModeApiError') : undefined}
        >
          {loading === 'all' ? t('admin.deleting') : t('admin.deleteAll')}
        </button>
      </div>

      {success && <p className="admin-panel__success" role="status">{success}</p>}
      {error && <p className="admin-panel__error" role="alert">{error}</p>}

      {showChangePassword && (
        <ChangeAdminPasswordModal
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {
            setShowChangePassword(false);
            setSuccess(t('admin.changePassword.success'));
            setError(null);
          }}
        />
      )}
    </section>
  );
}
