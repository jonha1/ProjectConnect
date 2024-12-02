"use client";
import "../../styles/accountInfo.page.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function AutoResizeTextarea({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    onChange(textarea.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="inputBox"
      style={{
        width: "100%",
        minHeight: "50px",
        resize: "none",
        overflow: "hidden",
      }}
    />
  );
}

// Createpost component
export default function Createpost() {
  const router = useRouter();

  // State for form data
  const [formData, setFormData] = useState({
    contactInfo: "",
    skills: "",
    aboutMe: "",
  });

  // State to store username
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  // Fetch username from cookies
  useEffect(() => {
    const username = Cookies.get("username");
    if (!username) {
      router.push("/login"); // Redirect to login if username is not found
    } else {
      setStoredUsername(username); // Store username in state
    }
  }, [router]);

  const isProduction =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";
  const apiUrl = isProduction ? "/api" : "http://127.0.0.1:5001/api";

  // Update state when input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit form data to backend
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(storedUsername);
    if (!storedUsername) {
      console.error("No username found in cookies.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/updateUserInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          username: storedUsername,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("User info updated:", result);
        router.push("/"); // Redirect to homepage
      } else {
        console.error("Error updating user info:", result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="formContainer">
        <div className="formHeader">
          <h1> Tell people about yourself</h1>
        </div>

        <form className="formInput" onSubmit={handleSubmit}>
          <AutoResizeTextarea
            placeholder="About Me"
            value={formData.aboutMe}
            onChange={(value) => handleInputChange("aboutMe", value)}
          />
          <AutoResizeTextarea
            placeholder="Contact Information"
            value={formData.contactInfo}
            onChange={(value) => handleInputChange("contactInfo", value)}
          />
          <AutoResizeTextarea
            placeholder="Skills"
            value={formData.skills}
            onChange={(value) => handleInputChange("skills", value)}
          />
          <div className="buttonContainer">
            <button
              type="button"
              className="submit-button"
              onClick={() => router.push("/")}
            >
              Skip
            </button>
            <button type="submit" className="submit-button">
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
