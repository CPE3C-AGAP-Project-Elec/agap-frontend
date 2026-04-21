import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWithText from "../../assets/logoWithText.png";
import googleIcon from "../../assets/icons/google.svg";
import { register } from "../../services/auth";
import "./SignUp.css";

export function SignUp() {
  const navigate = useNavigate();
  const welcomeLines = [
    ["SIGN UP", "NOW"],
    ["GET STARTED", "WITH AGAP"],
    ["CREATE YOUR", "ACCOUNT"],
  ];
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendCooldown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setWelcomeIndex((prev) => (prev + 1) % welcomeLines.length);
        setIsFading(false);
      }, 700);
    }, 6200);

    return () => clearInterval(interval);
  }, [welcomeLines.length]);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    setBackendError("");
    
    const newErrors = { email: "", password: "", confirmPassword: "" };
    let hasError = false;

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      setLoading(true);
      
      try {
        await register({
          name: email.split('@')[0],
          email: email,
          password: password
        });
        
        console.log("Registration successful");
        setVerificationSent(true);
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
      } catch (err) {
        console.error("Registration error:", err);
        setBackendError(err.message || "Registration failed. Please try again.");
        setPassword("");
        setConfirmPassword("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendVerification = () => {
    if (resendCooldown > 0) return;
    console.log("Resend verification email to:", email);
    setResendCooldown(60);
  };

  const handleUseDifferentEmail = () => {
    setVerificationSent(false);
    setResendCooldown(0);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({ email: "", password: "", confirmPassword: "" });
    setBackendError("");
  };

  const handleGoogleAuth = () => {
    console.log("Google signup");
  };

  return (
    <div className="login-page signup-page">
      <section className="login-left-panel">
        <img src={logoWithText} alt="AGAP logo" className="login-left-logo" />
        <h1 className="login-left-title">
          <span className={`login-left-title-text ${isFading ? "is-fading" : ""}`}>
            {welcomeLines[welcomeIndex][0]}
            <br />
            {welcomeLines[welcomeIndex][1]}
          </span>
        </h1>
      </section>

      <section className="login-right-panel">
        <div className="login-card">
          <h2>{verificationSent ? "Account Created!" : "Sign Up"}</h2>

          {verificationSent ? (
            <>
              <div className="signup-verification-box" role="status" aria-live="polite">
                <p className="signup-verification-lead">
                  Account created successfully! 🎉
                </p>
                <p className="signup-verification-hint">
                  You will be redirected to the login page shortly. Please log in with your credentials.
                </p>
              </div>
              <p className="login-signup-text">
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <p className="login-signup-text">
                Back to <Link to="/">Home</Link>
              </p>
            </>
          ) : (
            <form onSubmit={handleSignup} noValidate autoComplete="off">
              {backendError && (
                <div className="field-error" style={{ 
                  marginBottom: "16px", 
                  padding: "10px", 
                  background: "#fee2e2", 
                  borderRadius: "6px",
                  textAlign: "center"
                }}>
                  {backendError}
                </div>
              )}
              
              <div className="field-wrap">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  name="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                    setBackendError("");
                  }}
                />
                {errors.email ? <p className="field-error">{errors.email}</p> : null}
              </div>

              <div className="field-wrap">
                <label htmlFor="signup-password">Password</label>
                <div className="password-input-wrap">
                  <input
                    id="signup-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                      setBackendError("");
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 3L21 21M10.58 10.59A2 2 0 0 0 13.41 13.4M9.88 5.09A10.94 10.94 0 0 1 12 5C17 5 21.27 8.11 23 12C22.18 13.84 20.79 15.43 19 16.54M14.12 18.88A10.78 10.78 0 0 1 12 19C7 19 2.73 15.89 1 12C1.95 9.86 3.58 8.07 5.66 6.79" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12C2.73 8.11 7 5 12 5S21.27 8.11 23 12C21.27 15.89 17 19 12 19S2.73 15.89 1 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? <p className="field-error">{errors.password}</p> : null}
              </div>

              <div className="field-wrap">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="password-input-wrap">
                  <input
                    id="signup-confirm-password"
                    name="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      setBackendError("");
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 3L21 21M10.58 10.59A2 2 0 0 0 13.41 13.4M9.88 5.09A10.94 10.94 0 0 1 12 5C17 5 21.27 8.11 23 12C22.18 13.84 20.79 15.43 19 16.54M14.12 18.88A10.78 10.78 0 0 1 12 19C7 19 2.73 15.89 1 12C1.95 9.86 3.58 8.07 5.66 6.79" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12C2.73 8.11 7 5 12 5S21.27 8.11 23 12C21.27 15.89 17 19 12 19S2.73 15.89 1 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword ? <p className="field-error">{errors.confirmPassword}</p> : null}
              </div>

              <div className="or-divider">
                <span>Or with</span>
              </div>

              <button type="button" className="google-btn" onClick={handleGoogleAuth}>
                <img src={googleIcon} alt="Google" className="google-icon" />
                <span>Sign Up with Google</span>
              </button>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="login-signup-text">
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <p className="login-signup-text">
                Back to <Link to="/">Home</Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
