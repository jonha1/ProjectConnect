'use client';
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
  const [success, setSuccess] = useState('');
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          loginEmail: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          router.push('/accountInfo'); 
        }, 2000);
      } else {
        // Handle errors from the backend
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(err);
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
      {success && <div className="success">{success}</div>}
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
