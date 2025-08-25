import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { apiFetch } from '../utilss/apifetch';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return Swal.fire('Error', 'Please fill all fields', 'error');
    }

    if (password !== confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }

    try {
     const res = await apiFetch(`/api/auth/reset-password/${token}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ newPassword: password }),
});

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Success', data.message || 'Password reset successful!', 'success');
        navigate('/signin');
      } else {
        Swal.fire('Failed', data.message || 'Token invalid or expired', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold">Reset Your Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border px-3 py-2 rounded"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
