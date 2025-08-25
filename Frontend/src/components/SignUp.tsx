

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, WashingMachine, Phone } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiFetch } from '../utilss/apifetch'; // Adjust the import path as necessary

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contact: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, contact } = formData;
    if (!fullName || !email || !password || !confirmPassword || !contact) {
      Swal.fire({ icon: 'warning', title: 'Missing Information', text: 'Please fill in all fields', confirmButtonColor: '#3B82F6' });
      return false;
    }
    if (!email.includes('@')) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address', confirmButtonColor: '#3B82F6' });
      return false;
    }
    if (password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Password Too Short', text: 'Password must be at least 6 characters long', confirmButtonColor: '#3B82F6' });
      return false;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: "Passwords Don't Match", text: 'Please make sure both passwords match', confirmButtonColor: '#3B82F6' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          contact: formData.contact,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Signup failed');

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: json.message || 'Signup successful.',
        confirmButtonColor: '#3B82F6',
        timer: 1500,
        timerProgressBar: true,
      });

      navigate('/signin');
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Signup Error', text: err.message || 'Unexpected error. Please try again.', confirmButtonColor: '#3B82F6' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-white px-4 py-10 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20"></div>
        <div className="absolute top-32 right-20 w-28 h-28 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-36 h-36 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-10 w-20 h-20 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <WashingMachine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Join DhobiXpress
            </h1>
            <p className="text-gray-600">Create your account and get started!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField id="fullName" label="Full Name" icon={<User />} placeholder="Enter your full name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
            <InputField id="email" label="Email Address" icon={<Mail />} placeholder="Enter your email" type="email" name="email" value={formData.email} onChange={handleInputChange} />
            <InputField id="contact" label="Contact Number" icon={<Phone />} placeholder="Enter your contact number" type="tel" name="contact" value={formData.contact} onChange={handleInputChange} />

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="customer">Customer</option>
                <option value="washerman">Washerman</option>
              </select>
            </div>

            <InputField
              id="password"
              label="Password"
              icon={<Lock />}
              placeholder="Create a password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              toggleVisibility={() => setShowPassword(!showPassword)}
              visible={showPassword}
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              icon={<Lock />}
              placeholder="Confirm your password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
              visible={showConfirmPassword}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading
                ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Creating Account...</div>
                : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field Component
interface InputProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  name?: string;
  value: string;
  onChange: (e: any) => void;
  toggleVisibility?: () => void;
  visible?: boolean;
}

const InputField: React.FC<InputProps> = ({
  id, label, icon, placeholder,
  type = 'text', name, value, onChange,
  toggleVisibility, visible
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all"
      />
      {toggleVisibility && (
        <button type="button" onClick={toggleVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  </div>
);

export default SignUp;

