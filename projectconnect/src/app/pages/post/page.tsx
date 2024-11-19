"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as filledBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import Navbar from "../../components/navbar";
import "../../styles/project_view.css";

type ProjectViewProps = {
  userRole: "general" | "member" | "creator";
};

export default function ProjectView({ userRole }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState("everyone");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the pathname of the current route
  const pathname = usePathname();

  // State variables for project details
  const [projectDetails, setProjectDetails] = useState<any>({});

  // Extract creatorUsername and title from pathname
  useEffect(() => {
    if (pathname) {
      const urlParams = new URLSearchParams(window.location.search);
      const creator = urlParams.get("creator");
      let projectTitle = urlParams.get("title");

      if (projectTitle) {
        projectTitle = projectTitle.replace("-", " ");
      }

      fetchProjectInformation(creator, projectTitle);
    }
  }, [pathname]);

  const fetchProjectInformation = async (creator: string | null, projectTitle: string | null) => {
    if (!creator || !projectTitle) return;

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/getProjectInfo", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: projectTitle 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjectDetails({ ...data }); // Spread the object to ensure a new reference
    } catch (error) {
      console.error("Error fetching project information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkClick = () => {
    setIsBookmarked((prev) => !prev);
  };
  
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ width: "5rem", height: "5rem", color: "#2D2D2D" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  
  

  return (
    <>
      <Navbar />
      <div className="project-view-container">
        <div className="project-header"></div>
        <div className="content-bubble">
          <button className="bookmark-icon" onClick={handleBookmarkClick}>
            <FontAwesomeIcon icon={isBookmarked ? filledBookmark : emptyBookmark} />
          </button>
          <div className="left-column">
            <h3>Creator:</h3>
            <p className="creator-name">{projectDetails.project.creatorusername || "Unknown Creator"}</p>
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
                  <p>{projectDetails.project.title || "Untitled Project"}</p>
                  <h3>Description</h3>
                  <p>{projectDetails.project.description || "No description"}</p>
                  <h3>Links</h3>
                  <p>{projectDetails.project.links || "No links provided"}</p>
                  <div className="spacer"></div>
                  {userRole === "general" && (
                    <div className="buttonContainer">
                      <button className="requestJoinButton">Request Join</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="members-content">
                  <div className="members-section">
                    <h4>Member Description</h4>
                    <p>{projectDetails.project.memberdescription || "No member description available"}</p>
                    <h4>Member Links</h4>
                    <p>{projectDetails.project.memberlinks || "No member links available"}</p>
                    <h4>Member Contact Info</h4>
                    <p>{projectDetails.project.membercontactinfo || "No contact info available"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {userRole === "creator" && (
            <div className="buttonContainer">
              <button className="archiveButton">Archive</button>
              <button className="deleteButton">Delete</button>
              <button className="editButton">Edit</button>
              <button className="inviteButton">Invite</button>
            </div>
          )}
          {userRole === "member" && (
            <div className="buttonContainer">
              <button className="leaveButton">Leave</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
