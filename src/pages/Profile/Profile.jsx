import { Plus, Minus, Compass, Map, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/philippines-map-bg.svg";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-bg" style={{ backgroundImage: `url(${backgroundImage})` }} />

      <header className="profile-header">
        <Link to="/welcome" className="profile-brand" aria-label="AGAP home">
          <div className="profile-brand__titles">
            <div className="profile-brand__line">AUTOMATED GEOSPATIAL</div>
            <div className="profile-brand__line">ALERT PLATFORM</div>
          </div>
        </Link>

        <nav className="profile-nav" aria-label="Primary">
          <Link to="/welcome" className="profile-nav__link">
            Home
          </Link>
          <Link to="/about" className="profile-nav__link">
            About Us
          </Link>
          <Link to="/about#contact" className="profile-nav__link">
            Contact
          </Link>
          <Link to="/profile" aria-label="Profile" className="profile-nav__icon">
            <User aria-hidden />
          </Link>
        </nav>
      </header>

      <main className="profile-main">
        <div className="profile-main__inner">
          <section className="profile-map" aria-label="Map">
            <div className="profile-map__controls">
              <button type="button" className="profile-map__btn" aria-label="Zoom in">
                <Plus className="profile-map__icon-lg" strokeWidth={3} aria-hidden />
              </button>
              <button type="button" className="profile-map__btn" aria-label="Zoom out">
                <Minus className="profile-map__icon-lg" strokeWidth={3} aria-hidden />
              </button>
              <button type="button" className="profile-map__btn profile-map__btn--outlined" aria-label="Compass">
                <Compass className="profile-map__icon-sm" aria-hidden />
              </button>
              <button type="button" className="profile-map__btn" aria-label="Map layers">
                <Map className="profile-map__icon-sm" aria-hidden />
              </button>
              <button type="button" className="profile-map__btn" aria-label="Search">
                <Search className="profile-map__icon-sm" aria-hidden />
              </button>
            </div>
          </section>

          <aside className="profile-panel" aria-label="Account settings">
            <div className="profile-panel__inner">
              <h1 className="profile-panel__title">ACCOUNT SETTINGS</h1>

              <div className="profile-form">
                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-email">
                      Email
                    </label>
                    <button type="button" className="profile-field__action">
                      Change Email
                    </button>
                  </div>
                  <input id="profile-email" type="email" className="profile-field__input" />
                </div>

                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-password">
                      Password
                    </label>
                    <button type="button" className="profile-field__action">
                      Change Password
                    </button>
                  </div>
                  <input id="profile-password" type="password" className="profile-field__input" />
                </div>
              </div>

              <div className="profile-logout">
                <button
                  type="button"
                  className="profile-logout__link"
                  onClick={() => navigate("/login")}
                >
                  LOG OUT
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="profile-footer">
        <div className="profile-footer__inner">
          <div className="profile-footer__brand">
            <div className="profile-footer__titles">
              <div className="profile-footer__line">AUTOMATED GEOSPATIAL</div>
              <div className="profile-footer__line">ALERT PLATFORM</div>
            </div>
          </div>

          <div className="profile-footer__contact">
            <p>
              <span className="profile-footer__label">Email:</span> agap.system@gmail.com
            </p>
            <p>
              <span className="profile-footer__label">Phone:</span> +63 912 345 6789
            </p>
            <p>
              <span className="profile-footer__label">Location:</span> Malolos, Bulacan, Philippines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Plus, Minus, Compass, Map, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/philippines-map-bg.svg";
import logoImage from "../../assets/logo.svg";
import { clearSession } from "../../auth/session";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    clearSession();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      {/* Background */}
      <div className="profile-bg" style={{ backgroundImage: `url(${backgroundImage})` }} />

      {/* Header */}
      <header className="profile-header">
        <Link to="/" className="profile-brand">
          <img src={logoImage} alt="AGAP Logo" className="profile-brand__logo" />
          <div className="profile-brand__titles">
            <div className="profile-brand__line">AUTOMATED GEOSPATIAL</div>
            <div className="profile-brand__line">ALERT PLATFORM</div>
          </div>
        </Link>

        <div className="profile-nav">
          <Link to="/" className="profile-nav__link">
            Home
          </Link>
          <Link to="/about" className="profile-nav__link">
            About Us
          </Link>
          <Link to="/about#contact" className="profile-nav__link">
            Contact
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            className="profile-nav__icon"
          >
            <User aria-hidden />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-main__inner">
          {/* Left side - Map with controls */}
          <div className="profile-map">
            <div className="profile-map__controls">
              <button type="button" className="profile-map__btn" aria-label="Zoom in">
                <Plus className="profile-map__icon-lg" strokeWidth={3} aria-hidden />
              </button>
              <button type="button" className="profile-map__btn" aria-label="Zoom out">
                <Minus className="profile-map__icon-lg" strokeWidth={3} aria-hidden />
              </button>
              <button type="button" className="profile-map__btn profile-map__btn--outlined" aria-label="Compass">
                <Compass className="profile-map__icon-sm" aria-hidden />
              </button>
              <button type="button" className="profile-map__btn" aria-label="Map layers">
                <Map className="profile-map__icon-sm" aria-hidden />
              </button>
              <button type="button" className="profile-map__btn" aria-label="Search">
                <Search className="profile-map__icon-sm" aria-hidden />
              </button>
            </div>
          </div>

          {/* Right side - Account Settings Panel */}
          <aside className="profile-panel">
            <div className="profile-panel__inner">
              <h1 className="profile-panel__title">ACCOUNT SETTINGS</h1>

              <div className="profile-form">
                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label">Email</label>
                    <button type="button" className="profile-field__action">
                      Change Email
                    </button>
                  </div>
                  <input
                    type="email"
                    className="profile-field__input"
                  />
                </div>

                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label">Password</label>
                    <button type="button" className="profile-field__action">
                      Change Password
                    </button>
                  </div>
                  <input
                    type="password"
                    className="profile-field__input"
                  />
                </div>
              </div>

              <div className="profile-logout">
                <a href="/login" onClick={handleLogout} className="profile-logout__link">
                  LOG OUT
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="profile-footer__inner">
          <div className="profile-footer__brand">
            <img src={logoImage} alt="AGAP Logo" className="profile-footer__logo" />
            <div className="profile-footer__titles">
              <div className="profile-footer__line">AUTOMATED GEOSPATIAL</div>
              <div className="profile-footer__line">ALERT PLATFORM</div>
            </div>
          </div>

          <div className="profile-footer__contact">
            <p>
              <span className="profile-footer__label">Email:</span> agap.system@gmail.com
            </p>
            <p>
              <span className="profile-footer__label">Phone:</span> +63 912 345 6789
            </p>
            <p>
              <span className="profile-footer__label">Location:</span> Malolos, Bulacan, Philippines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
