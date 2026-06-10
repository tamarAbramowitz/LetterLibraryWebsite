import './AboutPage.css';

export function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-page__hero">
        <h1 className="about-page__title">About Letter Library</h1>
        <p className="about-page__lead">
          A curated collection of heartfelt letter templates to help you express what matters most.
        </p>
      </section>

      <section className="about-page__section">
        <h2>Our Mission</h2>
        <p>
          In a world of quick texts and fleeting messages, a thoughtful letter still holds
          extraordinary power. Letter Library was created to help you find the right words for
          life's meaningful moments — whether you're thanking a friend, celebrating a milestone,
          or reconnecting with someone you've missed.
        </p>
      </section>

      <section className="about-page__section">
        <h2>How It Works</h2>
        <div className="about-page__steps">
          <div className="about-page__step">
            <span className="about-page__step-number">1</span>
            <h3>Browse</h3>
            <p>Explore our collection of 16 letter templates across different categories and themes.</p>
          </div>
          <div className="about-page__step">
            <span className="about-page__step-number">2</span>
            <h3>Read</h3>
            <p>Open any letter to enjoy a clean, distraction-free reading experience.</p>
          </div>
          <div className="about-page__step">
            <span className="about-page__step-number">3</span>
            <h3>Personalize</h3>
            <p>Use the template as inspiration and adapt it with your own memories and voice.</p>
          </div>
        </div>
      </section>

      <section className="about-page__section">
        <h2>Features</h2>
        <ul className="about-page__features">
          <li>Search and filter letters by category</li>
          <li>Save your favorite letters for quick access</li>
          <li>Dark mode for comfortable evening reading</li>
          <li>Reading progress indicator on letter pages</li>
          <li>Share letters with friends and family</li>
          <li>Fully responsive on desktop, tablet, and mobile</li>
        </ul>
      </section>
    </div>
  );
}
