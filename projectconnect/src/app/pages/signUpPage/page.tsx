"use client";
import { supabase } from "../../lib/supabase";
import "../../styles/signUp.page.css";
import React, { useState } from "react";

export default function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const signup = async () => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpData) {
        console.log("Sign up successful:", signUpData);
      }

      if (error) {
        console.error("Sign up error:", error);
      }
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const{name, value} = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="loginContainer">
        <div id="title">ProjectConnect</div>
        <div id="description">Sign Up</div>
        <input id="email" type="text" name="email" placeholder="Email" value={data?.email} onChange={handleChange}></input>
        <input id="password" type="password" name="password" placeholder="Password" value={data?.password} onChange={handleChange}></input>
        <div className="buttonContainer">
          <button type="button" className="btn registerButtons" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );

}