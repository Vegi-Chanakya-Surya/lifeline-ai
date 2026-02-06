import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing">

      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <h1 className="logo">LifeLine AI</h1>
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <a href="/login">Login</a>
            <a href="/register" className="btn-primary">Get Started</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge">AI-Powered Wellness Platform</span>
            <h2>
              Smarter Fitness.<br />
              Healthier Living.
            </h2>
            <p>
              Personalized workout and nutrition plans that adapt in real time
              with an intelligent AI health companion.
            </p>

            <div className="hero-actions">
              <a className="btn-primary">Get Started Free</a>
              <a className="btn-secondary">See How It Works</a>
            </div>
          </div>

          <div className="preview-card">
            App Preview
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <h3>Everything you need to stay healthy</h3>

          <div className="feature-grid">
            <Feature
              title="Personalized Workouts"
              text="AI-generated routines tailored to your goals, fitness level, and schedule."
            />
            <Feature
              title="Smart Nutrition"
              text="Meal plans adapted to calories, dietary preferences, and allergies."
            />
            <Feature
              title="AROMI AI Coach"
              text="Real-time guidance for travel, injuries, or busy days."
            />
            <Feature
              title="Progress Tracking"
              text="Visual insights to track consistency and long-term improvement."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="how">
        <div className="container">
          <h3>How It Works</h3>
          <ol>
            <li>Create your profile</li>
            <li>Complete a health assessment</li>
            <li>Get AI-generated plans</li>
            <li>Track and adapt in real time</li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Start your wellness journey today</h3>
        <p>Simple. Personalized. Adaptive.</p>
        <a className="btn-primary">Create Free Account</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <p>© 2026 LifeLine AI</p>
          <div>
            <a>Privacy</a>
            <a>Terms</a>
            <a>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ title, text }) => (
  <div className="feature-card">
    <div className="icon">●</div>
    <h4>{title}</h4>
    <p>{text}</p>
  </div>
);

export default Landing;
