import { MapPin, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/logo.png";
import "./Welcome.css";

export default function Welcome() {
  const handleContactClick = (event) => {
    event.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <div className="welcome-header-inner">
          <div className="welcome-brand">
            <div className="welcome-brand-logo">
              <img src={logoImage} alt="AGAP logo" className="welcome-brand-logo-img" />
            </div>
            <div className="welcome-brand-text">
              <p>AUTOMATED GEOSPATIAL</p>
              <p>ALERT PLATFORM</p>
            </div>
          </div>

          <nav className="welcome-nav">
            <Link to="/">Home</Link>
            <Link to="/about-us">About Us</Link>
            <a href="#contact" onClick={handleContactClick}>Contact</a>
            <Link to="/login" className="welcome-user-link" aria-label="Go to login">
              <User size={18} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="welcome-main">
        <section className="welcome-search-card">
          <h1>Find Your Location</h1>
          <p>Get real-time flood risk updates based on your location.</p>

          <div className="welcome-search-row">
            <MapPin size={18} className="welcome-input-icon-left" />
            <input type="text" placeholder="Search Location" />
            <button type="button" aria-label="Search location">
              <Search size={18} />
            </button>
          </div>
        </section>
      </main>

      <div className="welcome-spacer" />

      <footer className="welcome-footer" id="contact">
        <div className="welcome-footer-inner">
          <div className="welcome-footer-brand">
            <div className="welcome-brand-logo">
              <img src={logoImage} alt="AGAP logo" className="welcome-brand-logo-img" />
            </div>
            <div className="welcome-brand-text">
              <p>AUTOMATED GEOSPATIAL</p>
              <p>ALERT PLATFORM</p>
            </div>
          </div>

          <div className="welcome-footer-contact">
            <h3>Contact Us</h3>
            <p>Email: agap.system@gmail.com</p>
            <p>Phone: +63 9XX XXX XXXX (optional)</p>
            <p>Location: Bulacan, Philippines</p>
          </div>
        </div>
        <p className="welcome-footer-copy">Copyright © 2026 AGAP All Rights Reserved</p>
      </footer>
    </div>
  );
}