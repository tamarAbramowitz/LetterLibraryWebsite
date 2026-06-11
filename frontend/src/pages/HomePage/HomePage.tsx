import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { deleteLetter, fetchLetters, invalidateLettersCache } from '../../api/letters';
import { AdminLoginModal } from '../../components/AdminLoginModal/AdminLoginModal';
import { AdminPanel } from '../../components/AdminPanel/AdminPanel';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { LetterCard } from '../../components/LetterCard/LetterCard';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { Pagination } from '../../components/Pagination/Pagination';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useAdmin } from '../../hooks/useAdmin';
import { useDebounce } from '../../hooks/useDebounce';
import { useFavorites } from '../../hooks/useFavorites';
import { translateCategory } from '../../i18n/categories';
import { useLocale } from '../../i18n/LocaleContext';
import type { Letter } from '../../types/letter';
import './HomePage.css';

const PAGE_SIZE = 9;

export function HomePage() {
  const location = useLocation();
  const { locale, t } = useLocale();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const { isAdmin, login, logout } = useAdmin();

  const loadLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    invalidateLettersCache();
    try {
      const data = await fetchLetters({
        search: debouncedSearch || undefined,
        category: category || undefined,
        page,
        pageSize: PAGE_SIZE,
        locale,
      });
      setLetters(data.letters);
      setTotal(data.total);
      setCategories(data.categories);
    } catch {
      setError(t('home.loadError'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, page, locale, t]);

  useEffect(() => {
    loadLetters();
  }, [loadLetters, location.key]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, locale]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDeleteLetter = async (letterId: number) => {
    if (!window.confirm(t('letterPage.deleteConfirm'))) return;
    try {
      await deleteLetter(letterId, { asAdmin: isAdmin });
      removeFavorite(letterId);
      loadLetters();
    } catch {
      window.alert(t('letterPage.deleteError'));
    }
  };

  const handleAdminLoginSuccess = () => {
    login();
    setShowAdminLogin(false);
  };

  const countText = loading
    ? t('home.loading')
    : total === 1
      ? t('home.letterCount', { count: total })
      : t('home.lettersCount', { count: total }) +
        (category ? t('home.inCategory', { category: translateCategory(category, locale) }) : '') +
        (debouncedSearch ? t('home.matching', { query: debouncedSearch }) : '');

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero__title">{t('home.heroTitle')}</h1>
        <p className="hero__subtitle">{t('home.heroSubtitle')}</p>
        <div className="hero__actions">
          <Link to="/create" className="hero__create-btn">
            <span className="hero__create-icon">✨</span>
            {t('home.createBtn')}
          </Link>
          {!isAdmin && (
            <button
              type="button"
              className="hero__admin-btn"
              onClick={() => setShowAdminLogin(true)}
            >
              {t('admin.loginBtn')}
            </button>
          )}
        </div>
      </section>

      {isAdmin && <AdminPanel onLogout={logout} onLettersChanged={loadLetters} />}

      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminLoginSuccess}
        />
      )}

      <section className="home-page__filters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t('search.placeholder')}
          ariaLabel={t('search.ariaLabel')}
          clearLabel={t('search.clear')}
        />
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </section>

      <div className="home-page__count">
        <span>{countText}</span>
      </div>

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onRetry={loadLetters} />}

      {!loading && !error && letters.length === 0 && (
        <div className="home-page__empty">
          <p>{t('home.empty')}</p>
        </div>
      )}

      {!loading && !error && letters.length > 0 && (
        <>
          <div className="home-page__grid">
            {letters.map((letter) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                isFavorite={isFavorite(letter.id)}
                isAdmin={isAdmin}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeleteLetter}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
