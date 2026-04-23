import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../../services/auth";
import logoWithText from "../../assets/logowithtext.png";
import "./verifyemail.css";


export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const email = location.state?.email || sessionStorage.getItem('pendingVerificationEmail') || "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmail(email, verificationCode);
      setSuccess(result.message || "Email verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await resendVerificationCode(email);
      setSuccess(result.message || "New verification code sent!");
      setResendCooldown(60);
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h2 className="verify-title">Verify Your Email</h2>
        <p className="verify-email-text">
          We sent a verification code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} noValidate>
          <div className="verify-input-group">
            <label htmlFor="verification-code">Verification Code</label>
            <input
              id="verification-code"
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value.replace(/\D/g, ''));
                setError("");
              }}
              autoFocus
            />
            {error && <div className="verify-error">{error}</div>}
            {success && <div className="verify-success">{success}</div>}
          </div>

          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <div className="verify-resend">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend verification code"}
            </button>
          </div>

          <div className="verify-links">
            <Link to="/signup">Use different email</Link>
            <span>•</span>
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
