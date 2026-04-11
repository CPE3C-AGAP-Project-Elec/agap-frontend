import heroImage from "../../assets/hero-img.svg";
import logoImage from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <div className="landing-header-left">
            <div className="landing-logo">
              <div className="landing-logo-icon">
                <img src={logoImage} alt="AGAP logo" className="landing-logo-image" />
              </div>
            </div>
            <nav className="landing-nav">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/result">Flood map</Link>
              <Link to="/about#contact">Contact</Link>
            </nav>
          </div>
          <div className="landing-auth">
            <button type="button" className="landing-login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button type="button" className="landing-signup-btn" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-hero-copy">
          <h1>
            <span>Stay ahead of floods.</span>
            <br />
            <span>Stay safe with </span>
            <span className="landing-highlight">AGAP</span>
            <span>.</span>
          </h1>
          <p>
            Get <span className="landing-highlight">real-time flood risk</span> updates and
            <br />
            <span className="landing-highlight">make smarter decisions</span> for your safety.
          </p>
          <div className="landing-hero-cta-wrap">
            <button
              type="button"
              className="landing-hero-cta"
              onClick={() => navigate("/result")}
            >
              Explore flood map
            </button>
          </div>
        </div>

        <div className="landing-hero-image-wrap">
          <img src={heroImage} alt="AGAP - Flood Monitoring System" className="landing-hero-image" />
        </div>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <div className="landing-footer-brand-icon">
                <img src={logoImage} alt="AGAP logo" className="landing-footer-logo-image" />
              </div>
              <div className="landing-footer-brand-text">
                <div>AGAP</div>
                <div>AUTOMATED GEOSPATIAL</div>
                <div>ALERT PLATFORM</div>
              </div>
            </div>
            <div className="landing-footer-contact">
              <h3>Contact Us</h3>
              <div>
                <p>Email: agap.system@gmail.com</p>
                <p>Phone: +63 912 345 6789</p>
                <p>Location: Malolos, Bulacan, Philippines</p>
              </div>
            </div>
          </div>

          <div className="landing-copyright">
            Copyright © 2026 AGAP All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}