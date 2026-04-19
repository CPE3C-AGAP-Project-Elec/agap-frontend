import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWithText from "../../assets/logoWithText.png";
import googleIcon from "../../assets/icons/google.svg";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const welcomeLines = [
    ["HELLO,", "WELCOME!"],
    ["STAY SAFE,", "STAY READY!"],
    ["MONITOR,", "RESPOND FAST!"],
  ];
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

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

  const handleLogin = (e) => {
    e.preventDefault();

    const nextErrors = { email: "", password: "" };
    let hasError = false;

    if (!email) {
      nextErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!password) {
      nextErrors.password = "Password is required";
      hasError = true;
    }

    setErrors(nextErrors);

    if (!hasError) {
      console.log("Login:", { email, password, rememberMe });
      navigate("/welcome");
    }
  };

  return (
    <div className="login-page">
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
          <h2>Login</h2>
          <form onSubmit={handleLogin} noValidate>
            <div className="field-wrap">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="login-password"
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
                  {showPassword ? (
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
                  )}
                </button>
              </div>
              {errors.password ? <p className="field-error">{errors.password}</p> : null}
            </div>

            <div className="login-meta-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password">Forget Password?</Link>
            </div>

            <div className="or-divider">
              <span>Or with</span>
            </div>

            <button type="button" className="google-btn">
              <img src={googleIcon} alt="Google" className="google-icon" />
              <span>Sign Up with Google</span>
            </button>

            <button type="submit" className="login-submit-btn">
              Login
            </button>

            <p className="login-signup-text">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <p className="login-signup-text">
              Back to <Link to="/welcome">Welcome</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}