"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/login.page.css";
import Cookies from "js-cookie";

export default function Login() {
  const [data, setData] = useState<{ check: string; password: string }>({
    check: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signin = async () => {
    try {
      const isProduction =
      window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? "/api/login"
        : "http://127.0.0.1:5001/api/login";

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          check: data.check,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Logged in:", result);
        Cookies.set("username", result.user, { expires: 30, path: "/" });
        router.push("/");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
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

      <input
        id="check"
        type="text"
        name="check"
        placeholder="Email or Username"
        value={data.check}
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

      {error && <div className="errorNotification">{error}</div>}

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
