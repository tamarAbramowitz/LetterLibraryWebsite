import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Footer } from './Footer';
import { Header } from './Header';
import { PageTransition } from '../PageTransition/PageTransition';
import './Layout.css';

export function Layout() {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="layout">
      <Header isDark={isDark} onToggleDark={toggle} />
      <main className="layout__main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
