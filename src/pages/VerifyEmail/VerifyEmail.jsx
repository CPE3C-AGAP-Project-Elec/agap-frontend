import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../../services/auth";
import logoImage from "../../assets/logo.png";

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
    const pendingEmail = location.state?.email || localStorage.getItem("pendingVerificationEmail");
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
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

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a5f7a 0%, #0d3b4f 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    container: {
      width: "100%",
      maxWidth: "480px",
    },
    card: {
      background: "white",
      borderRadius: "24px",
      padding: "40px 32px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      textAlign: "center",
    },
    logo: {
      marginBottom: "24px",
    },
    logoImg: {
      height: "60px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "12px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "14px",
      lineHeight: "1.6",
      marginBottom: "24px",
    },
    error: {
      background: "#fee2e2",
      color: "#dc2626",
      padding: "12px",
      borderRadius: "12px",
      fontSize: "14px",
      marginBottom: "20px",
    },
    success: {
      background: "#d1fae5",
      color: "#059669",
      padding: "12px",
      borderRadius: "12px",
      fontSize: "14px",
      marginBottom: "20px",
    },
    form: {
      marginBottom: "24px",
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#334155",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      textAlign: "center",
      letterSpacing: "4px",
      fontWeight: "600",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      background: "#1a5f7a",
      color: "white",
      border: "none",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "12px",
      cursor: "pointer",
    },
    footer: {
      display: "flex",
      justifyContent: "center",
      gap: "12px",
      fontSize: "14px",
    },
    link: {
      background: "none",
      border: "none",
      color: "#1a5f7a",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    divider: {
      color: "#cbd5e1",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <img src={logoImage} alt="AGAP Logo" style={styles.logoImg} />
          </div>
          
          <h1 style={styles.title}>Verify Your Email</h1>
          
          <p style={styles.subtitle}>
            We sent a verification code to:
            <br />
            <strong>{email}</strong>
          </p>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleVerify} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                autoFocus
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div style={styles.footer}>
            <button 
              onClick={handleResendCode} 
              style={styles.link}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
            <span style={styles.divider}>|</span>
            <button onClick={() => navigate("/signup")} style={styles.link}>
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
