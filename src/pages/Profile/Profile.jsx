import { Plus, Minus, Compass, Map, User, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, logout, isAuthenticated, getCurrentUser } from "../../services/auth";
import backgroundImage from "../../assets/philippines-map-bg.svg";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check authentication and load user data
  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Load user data
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    try {
      // First try to get from localStorage
      const localUser = getUser();
      if (localUser) {
        setUserData(localUser);
      }
      
      // Then fetch fresh data from backend
      const response = await getCurrentUser();
      if (response.success) {
        setUserData(response.data);
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    logout(); // This will redirect to login page
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      setError("Please enter a new email address");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // You'll need to add this endpoint to your backend
      // For now, we'll just update locally
      setError("");
      setSuccess("Email update functionality coming soon!");
      
      // Reset editing state
      setIsEditingEmail(false);
      setNewEmail("");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update email");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setError("Please fill in all password fields");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      // You'll need to add this endpoint to your backend
      // For now, we'll just show a message
      setError("");
      setSuccess("Password update functionality coming soon!");
      
      // Reset editing state
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update password");
      setTimeout(() => setError(""), 3000);
    }
  };

  const cancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail("");
    setError("");
  };

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-bg" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.5rem',
          color: '#2565a8'
        }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="profile-bg" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <p style={{ fontSize: '1.5rem', color: '#2565a8' }}>Unable to load profile data</p>
          <button 
            onClick={() => navigate("/login")}
            style={{
              padding: '10px 20px',
              background: '#2565a8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          <Link to="/about-us" className="profile-nav__link">
            About Us
          </Link>
          <Link to="/welcome#contact" className="profile-nav__link">
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
              {/* Dynamic greeting with user's name */}
              <h2 className="profile-panel__greeting">
                HI, {userData.name?.toUpperCase() || userData.email?.split('@')[0]?.toUpperCase() || "USER"}!!
              </h2>
              <h1 className="profile-panel__title">ACCOUNT SETTINGS</h1>

              {/* Display error or success messages */}
              {error && (
                <div style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              
              {success && (
                <div style={{
                  background: '#d1fae5',
                  color: '#059669',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {success}
                </div>
              )}

              <div className="profile-form">
                {/* Name Field - Add this before Email field */}
                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-name">
                      Name
                    </label>
                    <button type="button" className="profile-field__action">
                      Change Name
                    </button>
                  </div>
                  <input
                    id="profile-name"
                    type="text"
                    className="profile-field__input"
                    value={userData.name || ""}
                    readOnly
                  />
                </div>
                {/* Email Field */}
                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-email">
                      Email
                    </label>
                    {!isEditingEmail ? (
                      <button 
                        type="button" 
                        className="profile-field__action"
                        onClick={() => setIsEditingEmail(true)}
                      >
                        Change Email
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          type="button" 
                          className="profile-field__action"
                          onClick={handleChangeEmail}
                          style={{ color: '#059669' }}
                        >
                          Save
                        </button>
                        <button 
                          type="button" 
                          className="profile-field__action"
                          onClick={cancelEmailEdit}
                          style={{ color: '#dc2626' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!isEditingEmail ? (
                    <input
                      id="profile-email"
                      type="email"
                      className="profile-field__input"
                      value={userData.email || ""}
                      readOnly
                    />
                  ) : (
                    <input
                      id="profile-email"
                      type="email"
                      className="profile-field__input"
                      placeholder="Enter new email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>

                {/* Password Field */}
                <div className="profile-field">
                  <div className="profile-field__row">
                    <label className="profile-field__label" htmlFor="profile-password">
                      Password
                    </label>
                    {!isEditingPassword ? (
                      <button 
                        type="button" 
                        className="profile-field__action"
                        onClick={() => setIsEditingPassword(true)}
                      >
                        Change Password
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          type="button" 
                          className="profile-field__action"
                          onClick={handleChangePassword}
                          style={{ color: '#059669' }}
                        >
                          Save
                        </button>
                        <button 
                          type="button" 
                          className="profile-field__action"
                          onClick={cancelPasswordEdit}
                          style={{ color: '#dc2626' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!isEditingPassword ? (
                    <div className="profile-field__passwordWrap">
                      <input
                        id="profile-password"
                        type="password"
                        className="profile-field__input profile-field__input--password"
                        value="········"
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
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="profile-field__passwordWrap">
                        <input
                          type="password"
                          className="profile-field__input profile-field__input--password"
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="profile-field__passwordWrap">
                        <input
                          type="password"
                          className="profile-field__input profile-field__input--password"
                          placeholder="New password (min 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="profile-field__passwordWrap">
                        <input
                          type="password"
                          className="profile-field__input profile-field__input--password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
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
