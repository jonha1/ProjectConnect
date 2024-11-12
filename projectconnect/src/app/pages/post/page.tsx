"use client";
import Navbar from '../../components/navbar';
import "../../styles/project_view.css";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ProjectView() {
  const [activeTab, setActiveTab] = useState("everyone");
  const router = useRouter();

  const handleJoinClick = () => {
    alert("You have joined the project!");
  };

  return (
    <>
      <Navbar />
      <div className="project-view-container">
        <div className="project-header">
        </div>
        <div className="content-bubble">
          <div className="left-column">
            <h3>Creator:</h3>
            <p className="creator-name">MrBunnyMan47</p>
            <button className="view-profile-button">View Creator Profile</button>
            <button className="current-members-button">Current Members</button>
          </div>
          <div className="right-column">
            <div className="tab-container">
              <div
                className={`tab ${activeTab === "everyone" ? "active" : ""}`}
                onClick={() => setActiveTab("everyone")}
              >
                Everyone
              </div>
              <div
                className={`tab ${activeTab === "members" ? "active" : ""}`}
                onClick={() => setActiveTab("members")}
              >
                Members
              </div>
            </div>
            <div className="content-container">
              {activeTab === "everyone" ? (
                <div className="everyone-content">
                  <h2>Title</h2>
                  <p>Python Discord Bot</p>
                  <h3>Description</h3>
                  <p>
                    Creating a Discord bot to send cat memes to be used in my Discord channel when members are bored. Beginner friendly!
                    <br />
                    <strong>Tech stack:</strong> Python, Discord API
                  </p>
                  <h3>Links</h3>
                  <a href="https://discord.com/developers/docs/intro" target="_blank" rel="noopener noreferrer">
                    https://discord.com/developers/docs/intro
                  </a>
                  <button className="join-button" onClick={handleJoinClick}>Join</button>
                </div>
              ) : (
                <div className="members-content">
                  <p>Member details will be shown here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
