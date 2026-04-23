import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../../services/auth";
import logoImage from "../../assets/logo.png";
import "./verifyemail.css";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Get email from location state or localStorage
    const pendingEmail = location.state?.email || localStorage.getItem("pendingVerificationEmail");
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      // No email, redirect to signup
      navigate("/signup");
    }
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyEmail(email, code);
      if (response.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await resendVerificationCode(email);
      if (response.success) {
        setSuccess("New verification code sent to your email!");
      }
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-bg"></div>
      
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-logo">
            <img src={logoImage} alt="AGAP Logo" />
          </div>
          
          <h1 className="verify-title">Verify Your Email</h1>
          
          <p className="verify-subtitle">
            We sent a verification code to:
            <br />
            <strong>{email}</strong>
          </p>

          {error && <div className="verify-error">{error}</div>}
          {success && <div className="verify-success">{success}</div>}

          <form onSubmit={handleVerify} className="verify-form">
            <div className="verify-input-group">
              <label htmlFor="code">Verification Code</label>
              <input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                autoFocus
              />
            </div>

            <button type="submit" className="verify-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="verify-footer">
            <button 
              onClick={handleResendCode} 
              className="verify-resend"
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
            <span className="verify-divider">|</span>
            <button onClick={() => navigate("/signup")} className="verify-back">
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
