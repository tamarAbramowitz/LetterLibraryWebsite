import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">
          Letter Library — Beautiful templates for heartfelt messages.
        </p>
        <p className="footer__copy">© {new Date().getFullYear()} Letter Library</p>
      </div>
    </footer>
  );
}
