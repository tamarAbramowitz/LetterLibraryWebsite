import { Link, NavLink } from 'react-router-dom';
import { useLocale } from '../../i18n/LocaleContext';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import './Header.css';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Header({ isDark, onToggleDark }: HeaderProps) {
  const { t } = useLocale();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">✉</span>
          <span className="header__logo-text">{t('logo')}</span>
        </Link>

        <nav className="header__nav">
          <NavLink to="/" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
            {t('nav.create')}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
            {t('nav.about')}
          </NavLink>
        </nav>

        <div className="header__controls">
          <LanguageToggle />
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
        </div>
      </div>
    </header>
  );
}
