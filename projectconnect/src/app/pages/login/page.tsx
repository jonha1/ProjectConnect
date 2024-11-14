"use client";
import { useRouter } from "next/navigation";
import "../../styles/login.page.css";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const signin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Logged in:", result);
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
    router.push("/signup");  
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
      <div id="description">Login In</div>
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
