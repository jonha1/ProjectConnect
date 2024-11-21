"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as filledBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import Navbar from "../../components/navbar";
import "../../styles/project_view.css";
import { getUsernameFromCookie } from "../../lib/cookieUtils";

// Define the type for project details
interface ProjectDetails {
  creatorusername: string;
  title: string;
  description: string;
  links?: string;
  memberdescription?: string;
  memberlinks?: string;
  membercontactinfo?: string;
}

interface APIResponse {
  project: ProjectDetails;
}

// Props for the component
type ProjectViewProps = {
  userRole: "general" | "member" | "creator";
};

export default function ProjectView({ userRole }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState<"everyone" | "members">("everyone");
  const [isBookmarked, setIsBookmarked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | undefined>();
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);


  const pathname = usePathname(); // Get the current route's pathname

  // Extract creatorUsername and title from pathname and fetch project info
  useEffect(() => {
    const cookieUsername = getUsernameFromCookie(); // Retrieve the username from the cookie
    if (cookieUsername) {
      setUsername(cookieUsername); // Set the username in state
      console.log(username);
    }
    console.log("cookieUsername: ", cookieUsername);
    console.log("Username:", username);
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
      verifyBookmark(creator, projectTitle, cookieUsername);

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
          title: projectTitle,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Type the API response correctly
      const data: APIResponse = await response.json();
      setProjectDetails(data.project); // Extract `project` from the response       
    } catch (error) {
      console.error("Error fetching project information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyBookmark = async (creator: string | null, projectTitle: string | null, user: string | undefined) => {
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
          username: user
        }),
      });
      const data = await response.json();
      setIsBookmarked(data.result);
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
          style={{ width: "5rem", height: "5rem", color: "#2D2D2D" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "100vh" }}>
        <h2>No project details available.</h2>
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
            handleBookmarkClick(creator, title);
          }}>
            <FontAwesomeIcon icon={isBookmarked ? filledBookmark : emptyBookmark} />
          </button>
          <div className="left-column">
            <h3>Creator:</h3>
            <p className="creator-name">{projectDetails.creatorusername || "Unknown Creator"}</p>
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
                  <p>{projectDetails.title || "Untitled Project"}</p>
                  <h3>Description</h3>
                  <p>{projectDetails.description || "No description"}</p>
                  <h3>Links</h3>
                  <p>{projectDetails.links || "No links provided"}</p>
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
                    <p>{projectDetails.memberdescription || "No member description available"}</p>
                    <h4>Member Links</h4>
                    <p>{projectDetails.memberlinks || "No member links available"}</p>
                    <h4>Member Contact Info</h4>
                    <p>{projectDetails.membercontactinfo || "No contact info available"}</p>
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