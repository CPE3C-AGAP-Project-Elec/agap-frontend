// agap-frontend/src/pages/VerifyEmail/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationCode } from '../../services/auth';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Get email from location state or sessionStorage
    const storedEmail = location.state?.email || sessionStorage.getItem('pendingVerificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email, redirect to signup
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Clear error when user types
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log("Verifying with:", { email, code: fullCode });
    
    try {
      const result = await verifyEmail(email, fullCode);
      console.log("Verification result:", result);
      
      if (result.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error("Verification error details:", err);
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setResendLoading(true);
    setError('');
    
    try {
      const result = await resendVerificationCode(email);
      if (result.success) {
        setSuccess('New verification code sent to your email!');
        setResendTimer(60); // 60 seconds cooldown
        setCode(['', '', '', '', '', '']); // Clear code inputs
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h2>Verify Your Email</h2>
        <p>We sent a verification code to:</p>
        <p className="email-display">{email}</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            className="verify-button"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <div className="resend-section">
          <p>
            {resendTimer > 0 ? (
              `Resend code in ${resendTimer}s`
            ) : (
              <button 
                onClick={handleResendCode}
                className="resend-button"
                disabled={resendLoading}
              >
                {resendLoading ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/signup')}
          className="back-button"
        >
          Back to Sign Up
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
