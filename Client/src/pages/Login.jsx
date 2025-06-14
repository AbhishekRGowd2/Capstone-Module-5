// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authServices';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await authService.login(form);
  
      dispatch(loginSuccess(res.data));
      alert('Login successful!');
      navigate('/dashboard');
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("error : ", err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#EAEEEF]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-196">
        {/* App Title */}
        <div className="bg-[#6a1b9a] p-4 rounded-t-lg text-center">
          <h1 className="text-white text-2xl font-bold">MediEase – Your Health, Simplified</h1>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#6a1b9a]">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-[#6a1b9a] text-white py-2 rounded-md hover:bg-[#5a1480]"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">or</p>
            <button
              onClick={handleRegister}
              className="mt-2 bg-white border border-[#6a1b9a] text-[#6a1b9a] hover:bg-[#f3e5f5] py-2 px-4 rounded-md w-full"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Login;
