"use client";
import Navbar from '../../components/navbar';
import "../../styles/project_view.css";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

type ProjectViewProps = {
  userRole: "general" | "member" | "creator";
};

export default function ProjectView({ userRole }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState("everyone");
  const router = useRouter();

  const handleJoinClick = () => {
    alert("You have requested to join the project!");
  };

  const handleInvite = () => {
    alert("Invite functionality not yet implemented.");
  };

  const handleArchive = () => {
    alert("Project archived!");
  };

  const handleDelete = () => {
    alert("Project deleted!");
  };

  const handleEdit = () => {
    alert("Edit functionality not yet implemented.");
  };


  return (
    <>
      <Navbar />
      <div className="project-view-container">
        <div className="project-header"></div>
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
              {userRole !== "general" && (
                <div
                  className={`tab ${activeTab === "members" ? "active" : ""}`}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </div>
              )}
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
                  {userRole === "general" && (
                    <div className="buttonContainer">
                      <button className="requestJoinButton" onClick={handleJoinClick}>Request Join</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="members-content">
                  <div className="members-section">
                    <h4>More Description</h4>
                    <p>We currently have some code, but in the beginning stage.</p>
                    <h4>More Links</h4>
                    <a href="http://discord.join/channel=MrBunnyMan47andFriends">Discord Channel</a><br />
                    <a href="http://github.com/join/repo=CatMemeBot">GitHub Repository</a>
                    <h4>More Contact Info</h4>
                    <p>Email: MrBunnyMan47@gmail.com</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {userRole === "creator" && (
                    <div className="buttonContainer">
                      <button className="archiveButton" onClick={handleArchive}>Archive</button>
                      <button className="deleteButton" onClick={handleDelete}>Delete</button>
                      <button className="editButton" onClick={handleEdit}>Edit</button>
                      <button className="inviteButton" onClick={handleInvite}>Invite</button>
                    </div>
                  )}
        </div>
      </div>
    </>
  );
}
