"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import "../../styles/login.page.css";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const router = useRouter();

  const navigateToRegisterAccount = () => {
    router.push("/register");
  };

  const signin = async () => {
    try {
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginData) {
        console.log("Logged in:", loginData);
        router.refresh();
        router.push("/");
      }

      if (error) {
        console.error("Login error:", error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
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
        <input id="email" type="text" name="email" placeholder="Email" value={data?.email} onChange={handleChange}></input>
        <input id="password" type="password" name="password" placeholder="Password" value={data?.password} onChange={handleChange}></input>
        <div className="buttonContainer">
          <button type="button" className="btn registerButtons" onClick={signin}>
              Login
          </button>
          <button type="button" className="btn registerButtons" onClick={navigateToRegisterAccount}>
            Register
          </button>
        </div>
      </div>
    </>
  );

}
