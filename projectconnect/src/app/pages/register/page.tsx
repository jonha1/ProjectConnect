'use client';
import { supabase } from '../../lib/supabase';
import '../../styles/register.page.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    setError('');

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpData) {
        console.log('Sign up successful:', signUpData);
        router.push('/');
      }

      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="loginContainer">
      <div id="title">ProjectConnect</div>
      <input
        id="email"
        type="text"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        id="username"
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      {error && <div className="error">{error}</div>}
      <div className="buttonContainer">
        <button
          type="button"
          className="btn registerButtons"
          onClick={handleRegister}
        >
          Register Account
        </button>
      </div>
    </div>
  );
}
