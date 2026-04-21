import { Plus, Minus, Compass, Map, User, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/philippines-map-bg.svg";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
          <Link
            to="/profile"
            aria-label="Profile"
            className="profile-nav__icon profile-nav__icon--active"
          >
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
            </div>
          </section>

          <aside className="profile-panel" aria-label="Account settings">
            <div className="profile-panel__inner">
              <h2 className="profile-panel__greeting">HI, NAME!!</h2>
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
                  <input
                    id="profile-email"
                    type="email"
                    className="profile-field__input"
                    defaultValue="email@email.com"
                    readOnly
                  />
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
                  <div className="profile-field__passwordWrap">
                    <input
                      id="profile-password"
                      type="password"
                      className="profile-field__input profile-field__input--password"
                      defaultValue="password1234"
                      readOnly
                    />
                    <button type="button" className="profile-field__eye" aria-label="Toggle password visibility">
                      <EyeOff aria-hidden />
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-logout">
                <button type="button" onClick={handleLogout} className="profile-logout__link">
                  LOG OUT
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
