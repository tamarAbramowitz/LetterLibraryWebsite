import { Link, NavLink } from 'react-router-dom';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import './Header.css';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Header({ isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">✉</span>
          <span className="header__logo-text">Letter Library</span>
        </Link>

        <nav className="header__nav">
          <NavLink to="/" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
            About
          </NavLink>
        </nav>

        <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
      </div>
    </header>
  );
}
