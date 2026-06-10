import { translateCategory } from '../../i18n/categories';
import { useLocale } from '../../i18n/LocaleContext';
import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { locale, t } = useLocale();

  return (
    <div className="category-filter" role="group" aria-label={t('category.filterAria')}>
      <button
        className={`category-filter__badge ${!selected ? 'category-filter__badge--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        {t('category.all')}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-filter__badge ${selected === category ? 'category-filter__badge--active' : ''}`}
          onClick={() => onSelect(selected === category ? null : category)}
        >
          {translateCategory(category, locale)}
        </button>
      ))}
    </div>
  );
}
