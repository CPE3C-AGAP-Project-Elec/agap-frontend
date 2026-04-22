import { Plus, Minus, Compass, Map, User, EyeOff, Eye, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import backgroundImage from "../../assets/profile-bg.svg";
import heroBackgroundImage from "../../assets/philippines-map-bg.svg";
import logoImage from "../../assets/logo.png";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = userData.email || 'user@example.com';
  const userName = userData.name || 'User';

  const closeMenu = () => setIsMenuOpen(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 960);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine which background to use
  const currentBackground = isSmallScreen ? heroBackgroundImage : backgroundImage;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-bg" style={{ backgroundImage: `url(${currentBackground})` }} />

      <header className="about-nav bg-[#2565a8] text-white sticky top-0 z-50 shadow-md">
        <div className="about-nav__inner app-nav-inner">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="app-nav-logo-box shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-[#2565a8] p-1.5"
              onClick={closeMenu}
            >
              <img src={logoImage} alt="AGAP" className="w-full h-full object-contain" width={56} height={56} />
            </Link>
            <div className="hidden lg:grid app-nav-brand text-white">
              <p>AUTOMATED GEOSPATIAL</p>
              <p>ALERT PLATFORM</p>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-12">
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              <Link to="/" className="app-nav-link text-white px-3 py-2">
                Home
              </Link>
              <Link to="/about-us" className="app-nav-link text-white px-3 py-2">
                About Us
              </Link>
              <Link to="/landing" className="app-nav-link text-white px-3 py-2">
                Explore Map
              </Link>
              <Link to="/welcome#contact" className="app-nav-link text-white px-3 py-2">
                Contact
              </Link>
            </div>
            <Link to="/profile" className="app-profile-link app-profile-link--on-dark app-profile-link--active p-2 md:p-3" aria-label="Go to profile">
              <User size={20} className="md:scale-110" />
            </Link>
            <button type="button" className="md:hidden p-2.5" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#234d73] border-t border-white/20">
            <div className="px-6 py-4 space-y-2">
              <Link
                to="/"
                className="app-nav-link block w-full text-left py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className="app-nav-link block w-full text-left py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-colors"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link
                to="/landing"
                className="app-nav-link block w-full text-left py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-colors"
                onClick={closeMenu}
              >
                Explore Map
              </Link>
              <Link
                to="/welcome#contact"
                className="app-nav-link block w-full text-left py-3 px-4 text-white rounded-lg hover:bg-white/10 transition-colors"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="profile-main">
        <div className="profile-main__inner">
          <section className="profile-map" aria-label="Map">
          </section>

          <aside className="profile-panel" aria-label="Account settings">
            <div className="profile-panel__inner">
              <h2 className="profile-panel__greeting">Hi, {userName}!</h2>
              <h1 className="profile-panel__title">Account Settings</h1>

              <div className="profile-form">
                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-email">
                      Email
                    </label>
                  </div>
                  <input
                    id="profile-email"
                    type="email"
                    className="profile-field__input"
                    value={userEmail}
                    readOnly
                  />
                </div>

                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-password">
                      Password
                    </label>
                  </div>
                  <div className="profile-field__passwordWrap">
                    <input
                      id="profile-password"
                      type={showPassword ? "text" : "password"}
                      className="profile-field__input profile-field__input--password"
                      value={userData.password || "password1234"}
                      readOnly
                    />
                    <button 
                      type="button" 
                      className="profile-field__eye" 
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-logout">
                <button type="button" onClick={handleLogout} className="profile-logout__link">
                  Log Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
