'use client';

import React, { useState, ChangeEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Type definitions
interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

type AuthMode = 'login' | 'register' | 'forgot-password';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  type: NotificationType;
  message: string;
}

const App: React.FC = () => {
  const router = useRouter();
  
  // Auth state
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form data
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [forgotEmail, setForgotEmail] = useState<string>('');
  
  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Mock user database (in real app, this would be server-side)
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Test User', email: 'test@example.com' }, // password: 'password123'
  ]);

  // Utility functions
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Generate unique ID for new users
  const generateUserId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Save user to database (mock function - replace with real API call)
  const saveUserToDatabase = async (userData: { name: string; email: string; password: string }): Promise<User> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Registration failed');
  }

  const user = await res.json();
  return user;
};


  // Event handlers
  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(prev => !prev);
  };

  // Auth functions
  const handleLogin = async (): Promise<void> => {
    if (!loginData.email || !loginData.password) {
      showNotification('error', 'Please fill in all fields!');
      return;
    }

    if (!validateEmail(loginData.email)) {
      showNotification('error', 'Please enter a valid email address!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Mock authentication logic
          const user = users.find(u => u.email === loginData.email);
          if (user && loginData.password === 'password123') {
            resolve();
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 1500);
      });
      
      const user = users.find(u => u.email === loginData.email);
      if (user) {
        setCurrentUser(user);
        showNotification('success', `Welcome back, ${user.name}!`);
        
        if (rememberMe) {
          // In real app, store in secure storage
          localStorage.setItem('rememberUser', JSON.stringify(user));
        }
        
        // Redirect to welcome page
        setTimeout(() => {
          router.push('/welcome');
        }, 1000);
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Login failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      showNotification('error', 'Please fill in all fields!');
      return;
    }

    if (!validateEmail(registerData.email)) {
      showNotification('error', 'Please enter a valid email address!');
      return;
    }

    if (!validatePassword(registerData.password)) {
      showNotification('error', 'Password must be at least 6 characters long!');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showNotification('error', 'Passwords do not match!');
      return;
    }

    if (users.find(u => u.email === registerData.email)) {
      showNotification('error', 'An account with this email already exists!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save user to database
      const newUser = await saveUserToDatabase({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      });
      
      showNotification('success', 'Account created successfully! You can now log in.');
      setAuthMode('login');
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Pre-fill login form with new user's email
      setLoginData({
        email: newUser.email,
        password: ''
      });
      
    } catch (error) {
      showNotification('error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!forgotEmail) {
      showNotification('error', 'Please enter your email address!');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      showNotification('error', 'Please enter a valid email address!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });
      
      showNotification('success', 'Password reset link has been sent to your email!');
      setAuthMode('login');
      setForgotEmail('');
    } catch (error) {
      showNotification('error', 'Failed to send password reset email!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setLoginData({ email: '', password: '' });
    setRememberMe(false);
    localStorage.removeItem('rememberUser');
    showNotification('info', 'You have been logged out successfully.');
  };

  // If user is logged in, show welcome screen (temporary - will redirect to /welcome)
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-gray-400 mb-6">{currentUser.name}</p>
            <p className="text-gray-300 mb-8">{currentUser.email}</p>
            <p className="text-gray-400 mb-4">Redirecting to welcome page...</p>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white flex items-center space-x-2`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl"></div>
        
        <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              {authMode === 'register' ? <User className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {authMode === 'login' ? 'Welcome to BodAI' : 
               authMode === 'register' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="text-gray-400">
              {authMode === 'login' ? 'Login to your account' : 
               authMode === 'register' ? 'Create your new account' : 'Enter your email address'}
            </p>
          </div>

          {/* Login Form */}
          {authMode === 'login' && (
            <div className="space-y-6">
              <div className="relative">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot-password')}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Register Form */}
          {authMode === 'register' && (
            <div className="space-y-6">
              <div className="relative">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Password (min 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          {authMode === 'forgot-password' && (
            <div className="space-y-6">
              <div className="relative">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Info */}
      <div className="fixed bottom-4 left-4 bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-lg p-3 text-white text-xs max-w-xs">
        <p className="font-semibold mb-1">Demo Credentials:</p>
        <p>Email: test@example.com</p>
        <p>Password: password123</p>
        <p className="mt-2 text-gray-400">Or create a new account!</p>
      </div>
    </div>
  );
};

export default App;