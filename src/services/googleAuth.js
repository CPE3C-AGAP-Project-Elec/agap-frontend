import api from './api';

export const googleLogin = async (credential) => {
  try {
    const response = await api.post('/auth/google', { credential });
    console.log("Google auth response:", response.data);
    
    // Check if verification is required
    if (response.data.requiresVerification) {
      const email = response.data.email;
      console.log("Verification required for:", email);
      // Store email for verification
      sessionStorage.setItem('pendingVerificationEmail', response.data.email);
      return {
        success: false,
        requiresVerification: true,
        email: response.data.email,
        message: response.data.message
      };
    }
    
    // Normal login flow for verified users
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    console.error("Google login error:", error);
    // Check if error response requires verification
    if (error.response?.data?.requiresVerification) {
      const email = error.response?.data?.email;
      if (email) {
        sessionStorage.setItem('pendingVerificationEmail', email);
      }
      return {
        success: false,
        requiresVerification: true,
        email: email,
        message: error.response?.data?.message || 'Please verify your email'
      };
    }
    throw error.response?.data || { message: 'Google login failed' };
  }
};

export const decodeGoogleToken = (credential) => {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default {
  googleLogin,
  decodeGoogleToken
};
