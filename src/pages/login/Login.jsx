import React, { useState } from 'react';
import usePost from '../../hooks/usePost';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { postData } = usePost();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await postData(`${apiUrl}/api/login`, {
        username,
        password,
      });

      if (res.message === 'Login successful!') {
        const { token, user } = res; // ✅ FIXED: Directly use res.token, res.user

        localStorage.setItem('authToken', token);
        localStorage.setItem('username', user.username);

        Swal.fire('Success', 'Login Successful!', 'success');
        navigate(`/layout/${user.username}/dashboard`);
      } else {
        Swal.fire('Error', 'Login failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'An error occurred during login.', 'error');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Claim Manager Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          © 2025 Claim Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
