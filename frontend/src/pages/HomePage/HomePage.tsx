import { useCallback, useEffect, useState } from 'react';
import { fetchLetters } from '../../api/letters';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { LetterCard } from '../../components/LetterCard/LetterCard';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { Pagination } from '../../components/Pagination/Pagination';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useFavorites } from '../../hooks/useFavorites';
import type { Letter } from '../../types/letter';
import './HomePage.css';

const PAGE_SIZE = 9;

export function HomePage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search);
  const { isFavorite, toggleFavorite } = useFavorites();

  const loadLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLetters({
        search: debouncedSearch || undefined,
        category: category || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setLetters(data.letters);
      setTotal(data.total);
      setCategories(data.categories);
    } catch {
      setError('Unable to load letters. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    loadLetters();
  }, [loadLetters]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero__title">Letter Library</h1>
        <p className="hero__subtitle">
          Discover beautiful letter templates for every moment — from heartfelt thank-yous
          to milestone celebrations. Find the perfect words for someone you care about.
        </p>
      </section>

      <section className="home-page__filters">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </section>

      <div className="home-page__count">
        {loading ? (
          <span>Loading letters...</span>
        ) : (
          <span>
            {total} {total === 1 ? 'letter' : 'letters'} found
            {category && ` in "${category}"`}
            {debouncedSearch && ` matching "${debouncedSearch}"`}
          </span>
        )}
      </div>

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onRetry={loadLetters} />}

      {!loading && !error && letters.length === 0 && (
        <div className="home-page__empty">
          <p>No letters match your search. Try a different keyword or category.</p>
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
                onToggleFavorite={toggleFavorite}
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
