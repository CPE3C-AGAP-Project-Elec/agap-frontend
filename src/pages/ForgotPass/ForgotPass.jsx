import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../services/auth";
import "./ForgotPass.css";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend - FIXED
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle sending reset code
  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess("Reset code sent to your email!");
        setStep(2);
        setResendCooldown(60);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!resetCode || resetCode.length !== 6) {
      setError("Please enter a valid 6-digit reset code");
      return;
    }

    setError("");
    setStep(3);
  };

  // Handle resetting password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await resetPassword(email, resetCode, newPassword);
      if (result.success) {
        setSuccess("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess("New reset code sent!");
        setResendCooldown(60);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // Password strength functions
  const getStrengthPercentage = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) score++;
    return (score / 5) * 100;
  };

  const getStrengthColor = () => {
    const percentage = getStrengthPercentage();
    if (percentage <= 20) return "#dc2626";
    if (percentage <= 40) return "#f97316";
    if (percentage <= 60) return "#eab308";
    if (percentage <= 80) return "#84cc16";
    return "#22c55e";
  };

  const getStrengthText = () => {
    const percentage = getStrengthPercentage();
    if (percentage <= 20) return "Very Weak";
    if (percentage <= 40) return "Weak";
    if (percentage <= 60) return "Fair";
    if (percentage <= 80) return "Good";
    return "Strong";
  };

  const isPasswordValid = () => {
    return newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) &&
      newPassword === confirmPassword;
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h2 className="forgot-password-title">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Enter Reset Code"}
          {step === 3 && "Create New Password"}
        </h2>

        {step === 1 && (
          <>
            <p className="forgot-password-lead">
              Enter your email address and we'll send you a reset code to change your password.
            </p>

            <form onSubmit={handleSendCode} noValidate>
              <div className="forgot-password-field">
                <label htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={error ? "forgot-password-input--error" : undefined}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {error ? <p className="forgot-password-error">{error}</p> : null}
              </div>

              <button type="submit" className="forgot-password-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <div>
                <Link to="/login" className="forgot-password-back">
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="forgot-password-lead">
              We sent a 6-digit reset code to <strong>{email}</strong>. Please enter it below.
            </p>

            <form onSubmit={handleVerifyCode} noValidate>
              <div className="forgot-password-field">
                <label htmlFor="reset-code">Reset Code</label>
                <input
                  id="reset-code"
                  type="text"
                  maxLength="6"
                  value={resetCode}
                  onChange={(e) => {
                    setResetCode(e.target.value.replace(/\D/g, ''));
                    setError("");
                  }}
                  placeholder="Enter 6-digit code"
                />
                {error ? <p className="forgot-password-error">{error}</p> : null}
                {success ? <p className="forgot-password-success" style={{ color: '#059669' }}>{success}</p> : null}
              </div>

              <button type="submit" className="forgot-password-submit">
                Verify Code
              </button>

              <div className="forgot-password-success-hint" style={{ textAlign: 'center', marginTop: '16px' }}>
                Didn't receive the code?{" "}
                <button type="button" onClick={handleResendCode} disabled={resendCooldown > 0}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>

              <div>
                <button type="button" onClick={() => setStep(1)} className="forgot-password-back" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Back to Email
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="forgot-password-lead">
              Create a new password for <strong>{email}</strong>
            </p>

            <form onSubmit={handleResetPassword} noValidate>
              <div className="forgot-password-field">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter new password"
                />
              </div>

              {/* Password Requirements Display */}
              {newPassword && (
                <div className="password-requirements" style={{ marginBottom: '16px' }}>
                  <div className="strength-bar-container">
                    <div
                      className="strength-bar"
                      style={{
                        width: `${getStrengthPercentage()}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    />
                  </div>
                  <p className="strength-text" style={{ color: getStrengthColor() }}>
                    {getStrengthText()} Password
                  </p>
                  <ul className="requirements-list">
                    <li style={{ color: newPassword.length >= 8 ? "#22c55e" : "#dc2626" }}>
                      {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
                    </li>
                    <li style={{ color: /[A-Z]/.test(newPassword) ? "#22c55e" : "#dc2626" }}>
                      {/[A-Z]/.test(newPassword) ? "✓" : "○"} At least 1 uppercase letter
                    </li>
                    <li style={{ color: /[a-z]/.test(newPassword) ? "#22c55e" : "#dc2626" }}>
                      {/[a-z]/.test(newPassword) ? "✓" : "○"} At least 1 lowercase letter
                    </li>
                    <li style={{ color: /[0-9]/.test(newPassword) ? "#22c55e" : "#dc2626" }}>
                      {/[0-9]/.test(newPassword) ? "✓" : "○"} At least 1 number
                    </li>
                    <li style={{ color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? "#22c55e" : "#dc2626" }}>
                      {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? "✓" : "○"} At least 1 special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}

              <div className="forgot-password-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm new password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="forgot-password-error" style={{ marginTop: '8px' }}>
                    Passwords do not match
                  </p>
                )}
              </div>

              {error ? <p className="forgot-password-error">{error}</p> : null}
              {success ? <p className="forgot-password-success" style={{ color: '#059669' }}>{success}</p> : null}

              <button
                type="submit"
                className="forgot-password-submit"
                disabled={loading || !isPasswordValid()}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div>
                <Link to="/login" className="forgot-password-back">
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
