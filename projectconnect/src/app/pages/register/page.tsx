'use client';
import '../../styles/register.page.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    displayname: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success] = useState('');
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //validate all fields are entered to create account
  const handleRegister = async () => {
    if (!formData.email || !formData.username  || !formData.displayname || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) { //VALIDATE PASSWORDS
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    // Validate username for spaces
    if (formData.username.trim() !== formData.username || formData.username.includes(' ')) {
      setError('Username cannot contain spaces.');
      return;
    }
    setError('');
    try {
      //change
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? '/api/register'
        : 'http://127.0.0.1:5001/api/register';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginEmail: formData.email,
          displayname: formData.displayname,
          username: formData.username,
          password: formData.password,
        }),
        
      });

      if (response.ok) {
        // Save the username to a cookie using js-cookie
        Cookies.set('username', formData.username, { expires: 30, path: '/' }); // Cookie valid for 30 days
        router.push('/accountInfo'); // Redirect to the account page
      } else {
        const result = await response.json();
        setError(result.error || 'Registration failed.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error(error);
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
        id="displayname"
        type="text"
        name="displayname"
        placeholder="Display Name"
        value={formData.displayname}
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
