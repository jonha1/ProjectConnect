"use client";
import Navbar from '../../components/navbar';
import "../../styles/project_view.css";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ProjectView() {
  const [activeTab, setActiveTab] = useState("everyone");
  const router = useRouter();

  const handleJoinClick = () => {
    alert("You have requested to join the project!");
  };

  const handleInvite = () => {
    // Placeholder function for Invite action
    alert("Invite functionality not yet implemented.");
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
                  <div className="spacer"></div>
                  <div className="buttonContainer">
                    <button className="requestJoinButton" onClick={handleJoinClick}>Request Join</button>
                  </div>
                </div>
              ) : (
                <div className="members-content">
                  <div className = "members-section">
                    <h3>More Description</h3>
                    <p>We currently have some code, but in the beginning stage.</p>
                    <h3>More Links</h3>
                    <a href="http://discord.join/channel=MrBunnyMan47andFriends">Discord Channel</a><br />
                    <a href="http://github.com/join/repo=CatMemeBot">GitHub Repository</a>
                    <h3>More Contact Info</h3>
                    <p>Email: MrBunnyMan47@gmail.com</p>
                  </div>
                  <div className="buttonContainer">
                    <button className="archiveButton">Archive</button>
                    <button className="deleteButton">Delete</button>
                    <button className="editButton">Edit</button>
                    <button className="inviteButton" onClick={handleInvite}>Invite</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
