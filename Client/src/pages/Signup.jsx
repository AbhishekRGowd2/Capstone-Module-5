import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import authService from '../services/authServices';


const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', contactNumber: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await authService.signup(form);
      console.log("Signup successful:", response.data);
      toast.success("Signup successful");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };



  return (
    <div className="min-h-screen bg-[#EAEEEF] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-[600px] overflow-hidden">
        {/* App Title */}
        <div className="bg-[#6a1b9a] p-4 text-center">
          <h1 className="text-white text-2xl font-bold">MediEase – Your Health, Simplified</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-[#333446]">Signup</h2>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="contactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-[#6a1b9a] text-white px-4 py-2 rounded w-full hover:bg-[#5a1480]"
          >
            Register
          </button>
          <a
            href="/"
            className="bg-white text-[#6a1b9a] border border-[#6a1b9a] px-4 py-2 rounded w-full block text-center hover:bg-[#f3e5f5]"
          >
            Already have an account? Sign In
          </a>
        </form>
      </div>
    </div>
  );
};

export default Signup;
