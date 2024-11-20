"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as filledBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import Navbar from "../../components/navbar";
import "../../styles/project_view.css";
import { getUsernameFromCookie } from "../../lib/cookieUtils";

type ProjectViewProps = {
  userRole: "general" | "member" | "creator";
};

export default function ProjectView({ userRole }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState("everyone");
  const [isBookmarked, setIsBookmarked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");

  // Get the pathname of the current route
  const pathname = usePathname();

  // State variables for project details
  const [projectDetails, setProjectDetails] = useState<any>({});

  // Extract creatorUsername and title from pathname
  useEffect(() => {
    const cookieUsername = getUsernameFromCookie(); // Retrieve the username from the cookie
    if (cookieUsername) {
      setUsername(cookieUsername); // Set the username in state
    }
    if (pathname) {
      const urlParams = new URLSearchParams(window.location.search);
      const creator = urlParams.get("creator");
      setCreator(creator);
      let projectTitle = urlParams.get("title");
      setTitle(projectTitle);
      if (projectTitle) {
        projectTitle = projectTitle.replace("-", " ");
      }
      fetchProjectInformation(creator, projectTitle);
      console.log("verifying if bookmark exists");
      setIsBookmarked(verifyBookmark(creator,title))
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

  const verifyBookmark = async (creator: string | null, projectTitle: string | null) =>{
    if (!creator || !projectTitle) return;
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/verifyBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: projectTitle,
          username: username
        }),
      });
      console.log("seeing if bookmark already exists");
      const data = await response.json;
      console.log(data);
      setIsBookmarked(data)
    } catch (error) {
      console.error("Error fetching adding bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmark = async (creator: string | null, projectTitle: string | null) => {
    if (!creator || !projectTitle) return;
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/addBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: projectTitle,
          username: username
        }),
      });
      console.log("Sent data to add bookmark");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching adding bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const delBookmark = async (creator: string | null, projectTitle: string | null) => {
    if (!creator || !projectTitle) return;
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/deleteBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: projectTitle,
          username: username
        }),
      });
      console.log("Sent data to delete bookmark");
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching adding bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleBookmarkClick = (creator: string | null, projectTitle: string | null) => {
    console.log("handling click");
    if(!isBookmarked){
      console.log("not bookmarked, adding bookmark");
      addBookmark(creator, projectTitle);
    }
    else{
      console.log("bookmarked, removing bookmark");
      delBookmark(creator, projectTitle);
    }
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
          style={{ width: "5rem", height: "5rem" }}
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
          <button className="bookmark-icon" onClick={(event)=>{
            event.preventDefault();
            handleBookmarkClick(projectDetails.project.creatorusername, projectDetails.project.title);
          }}>
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
