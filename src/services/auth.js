// agap-frontend/src/services/auth.js
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success) {
      // Don't auto-login, just save email for verification
      if (response.data.data?.email) {
        localStorage.setItem('pendingVerificationEmail', response.data.data.email);
      }
      // Clear any existing tokens (user not verified yet)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error.response?.data);
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const verifyEmail = async (email, code) => {
  try {
    const response = await api.post('/auth/verify-email', { email, code });
    
    if (response.data.success) {
      // Clear pending email
      localStorage.removeItem('pendingVerificationEmail');
    }
    
    return response.data;
  } catch (error) {
    console.error('Verification error:', error.response?.data);
    throw error.response?.data || { message: 'Verification failed' };
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    console.error('Resend error:', error.response?.data);
    throw error.response?.data || { message: 'Failed to resend code' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('pendingVerificationEmail');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user' };
  }
};

export const updateUserDetails = async (userData) => {
  try {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user details' };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error.response?.data || { message: 'Failed to send reset code' };
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { email, code, newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};
