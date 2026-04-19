import heroImage from "../../assets/hero-img.svg";
import logoImage from "../../assets/logo.png";
import { useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollFromResult = location.state?.scrollToLandingContact === true;

  useLayoutEffect(() => {
    const hashContact = location.hash === "#contact";
    if (!hashContact && !scrollFromResult) return;

    const scroll = () =>
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });

    scroll();
    requestAnimationFrame(scroll);

    if (scrollFromResult) {
      navigate({ pathname: "/", hash: "contact" }, { replace: true, state: {} });
    }
  }, [location.hash, location.pathname, scrollFromResult, navigate]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <div className="landing-header-left">
            <div className="landing-logo">
              <div className="landing-logo-icon app-nav-logo-box">
                <img src={logoImage} alt="AGAP logo" className="landing-logo-image" />
              </div>
            </div>
            <nav className="landing-nav">
              <Link to="/" className="landing-nav-link">
                Home
              </Link>
              <Link to="/about-us" className="landing-nav-link">
                About Us
              </Link>
              <Link to="/result" className="landing-nav-link">
                Explore Map
              </Link>
              <Link
                to="/#contact"
                className="landing-nav-link"
                onClick={() => {
                  requestAnimationFrame(() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }}
              >
                Contact
              </Link>
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
        </div>

        <div className="landing-hero-image-wrap">
          <img src={heroImage} alt="AGAP - Flood Monitoring System" className="landing-hero-image" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}