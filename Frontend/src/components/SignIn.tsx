import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, WashingMachine } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiFetch } from '../utilss/apifetch';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !role) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all fields',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    if (!email.includes('@')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const result = await response.json();
      setIsLoading(false);

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: result.message || 'You have successfully signed in',
          confirmButtonColor: '#3B82F6',
          timer: 1000,
          timerProgressBar: true,
        });

        if (result.token) {
          localStorage.setItem('token', result.token);
          if (result.userId) {
            localStorage.setItem('userId', result.userId);
          } else {
            const decoded = JSON.parse(atob(result.token.split('.')[1]));
            if (decoded.userId) localStorage.setItem('userId', decoded.userId);
            if (decoded.role) localStorage.setItem('role', decoded.role);
          }
        }

        if (role === 'customer') navigate('/mainapp');
        else if (role === 'washerman') navigate('/LaundrymanDashboard');
        else if (role === 'admin') navigate('/AdminDashboard');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Sign In Failed',
          text: result.message || 'Invalid email or password',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong. Please try again later.',
        confirmButtonColor: '#3B82F6',
      });
      console.error('SignIn error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-white px-4 py-10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <WashingMachine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              DhobiXpress
            </h1>
            <p className="text-gray-600">Welcome back! Please sign in to your account</p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="customer">Customer</option>
                <option value="washerman">Dhobi</option>
                <option value="admin">Admin</option>
              </select>
            </div>
<div className="text-right">
  <button
    type="button"
    onClick={async () => {
      const { value: email } = await Swal.fire({
        title: 'Forgot Password',
        input: 'email',
        inputLabel: 'Enter your registered email address',
        inputPlaceholder: 'you@example.com',
        confirmButtonText: 'Send Reset Link',
        confirmButtonColor: '#3B82F6',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        inputValidator: (value) => {
          if (!value) {
            return 'Email is required';
          } else if (!value.includes('@')) {
            return 'Invalid email format';
          }
        },
      });

      if (email) {
        try {
          const response = await apiFetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const result = await response.json();

          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Email Sent!',
              text: 'A password reset link has been sent to your email.',
              confirmButtonColor: '#3B82F6',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed to Send',
              text: result.message || 'Email not found or server error.',
              confirmButtonColor: '#3B82F6',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#3B82F6',
          });
        }
      }
    }}
    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
  >
    Forgot password?
  </button>
</div>

           


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;




