"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import "../../styles/login.page.css";
import { useState } from "react";
import Cookies from 'js-cookie';

export default function Login() {
  const [data, setData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const router = useRouter();

  // const navigateToRegisterAccount = () => {
  //   router.push("/register");
  // };

  const signin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Logged in:", result);
        // Expires in 7 days
        Cookies.set('username', result.user, { expires: 7, path: '/' });
        router.refresh();
        router.push("/");
      } else {
        console.error("Login error:", result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const signup = () => {
    router.push("/register");  
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="loginContainer">
      <div id="title">ProjectConnect</div>
      {/* <div id="description">Login In</div> */}
      <input
        id="email"
        type="text"
        name="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
      />
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={handleChange}
      />
      <div className="buttonContainer">
        <button type="button" className="btn registerButtons" onClick={signin}>
          Sign In
        </button>
        <button type="button" className="btn registerButtons" onClick={signup}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
