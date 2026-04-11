import { useEffect, useState } from "react";
import logoWithText from "../../assets/logoWithText.png";
import googleIcon from "../../assets/icons/google.svg";
import "./SignUp.css";

export function SignUp() {
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

  const handleSignup = (e) => {
    e.preventDefault();

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
      console.log("Sign up:", { email, password, confirmPassword });
    }
  };

  const handleGoogleAuth = () => {
    console.log("Google signup");
  };

  const passwordToggleIcon = (visible) =>
    visible ? (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 3L21 21M10.58 10.59A2 2 0 0 0 13.41 13.4M9.88 5.09A10.94 10.94 0 0 1 12 5C17 5 21.27 8.11 23 12C22.18 13.84 20.79 15.43 19 16.54M14.12 18.88A10.78 10.78 0 0 1 12 19C7 19 2.73 15.89 1 12C1.95 9.86 3.58 8.07 5.66 6.79"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M1 12C2.73 8.11 7 5 12 5S21.27 8.11 23 12C21.27 15.89 17 19 12 19S2.73 15.89 1 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );

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
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup} noValidate>
            <div className="field-wrap">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
            </div>

            <div className="field-wrap">
              <label htmlFor="signup-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {passwordToggleIcon(showPassword)}
                </button>
              </div>
              {errors.password ? <p className="field-error">{errors.password}</p> : null}
            </div>

            <div className="field-wrap">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="password-input-wrap">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {passwordToggleIcon(showConfirmPassword)}
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

            <button type="submit" className="login-submit-btn">
              Sign Up
            </button>

            <p className="login-signup-text">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
