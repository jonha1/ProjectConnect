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
  isarchived: boolean; 
  tag: string;
}

interface APIResponse {
  project: ProjectDetails;
}

type UserRole = "general" | "member" | "creator";


export default function ProjectView() {
  const [activeTab, setActiveTab] = useState<"everyone" | "members">("everyone");
  const [isBookmarked, setIsBookmarked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [userRole, setUserRole] = useState<UserRole>();
  const pathname = usePathname(); // Get the current route's pathname
  const [requestSent, setRequestSent] = useState(false);
  // const [archived, setArchived] = useState("");

  // Extract creatorUsername and title from pathname and fetch project info
  useEffect(() => {
    const cookieUsername = getUsernameFromCookie(); // Retrieve the username from the cookie
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
      verifyBookmark(creator, projectTitle, cookieUsername);
    }
  }, [pathname]);

  useEffect(() => {
    if (projectDetails) {
      const currentUsername = getUsernameFromCookie();
      console.log("Verifying membership for user:", currentUsername);
  
      if(currentUsername == projectDetails.creatorusername){
        console.log("they are the creator");
        setUserRole("creator");
        setIsLoading(false);
      }
      else{
        // Run verifyMembership with updated projectDetails
        verifyMembership(currentUsername, projectDetails.creatorusername, projectDetails.title);
      }
      // if (projectDetails.isarchived){
      //   setArchived("Unarchive");
      // } else {
      //   setArchived("Archive");
      // }

    }
  }, [projectDetails]);

  const verifyMembership = async (
    memberusername: string | null,
    creator: string | null,
    projectTitle: string | null
  ) => {
    if (!memberusername || !creator || !projectTitle) return;
    try {
      const response = await fetch("http://localhost:5001/verifyMembership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membersusername: memberusername,
          creatorusername: creator,
          title: projectTitle,
        }),
      });
      if (response.ok) {
        setUserRole("member"); // Set role to member
      } else {
        setUserRole("general"); // Fallback to general
      }
    } catch (error) {
      console.log("error: ", error);
      setUserRole("general"); // Fallback to general on error
    }finally {
      setIsLoading(false);
    }
  };

  const fetchProjectInformation = async (creator: string | null, projectTitle: string | null) => {
    if (!creator || !projectTitle) return;

    try {
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
      console.log(data);
      setProjectDetails(data.project); // Extract `project` from the response 
    } catch (error) {
      console.error("Error fetching project information:", error);
    }
  };

  const verifyBookmark = async (creator: string | null, projectTitle: string | null, user: string | undefined) => {
    try {
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
    }
  };


  const addBookmark = async (creator: string | null, projectTitle: string | null) => {
    const cookieUsername = getUsernameFromCookie();
    if (!creator || !projectTitle) return;
    try {
      const response = await fetch("http://localhost:5001/addBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: projectTitle,
          username: cookieUsername
        }),
      });
      const data = await response.json();
      if (data.result == 'error') {
        throw new Error(`HTTP error! status: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching adding bookmark:", error);
    }
  };

  const delBookmark = async (creator: string | null, projectTitle: string | null) => {
    const cookieUsername = getUsernameFromCookie();
    if (!creator || !projectTitle) return;
    try {
      const response = await fetch("http://localhost:5001/deleteBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: projectTitle,
          username: cookieUsername
        }),
      });
      const data = await response.json();
      if (data.result == 'error') {
        throw new Error(`HTTP error! status: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching adding bookmark:", error);
    }
  };


  const handleBookmarkClick = (creator: string | null, projectTitle: string | null) => {
    if(!isBookmarked){
      addBookmark(creator, projectTitle);
    }
    else{
      delBookmark(creator, projectTitle);
    }
    setIsBookmarked((prev) => !prev);
  };

  const handleDeleteProject = async () => {
    if (!projectDetails) return;

    const { creatorusername, title } = projectDetails;

    try {
      const response = await fetch("http://localhost:5001/delete-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorusername: creatorusername,
          title: title,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Project deleted:", result);
        alert("Project deleted successfully!");
        // Navigate to another page or refresh the data
        window.location.href = "/"; // Redirect to the homepage or project list
      } else {
        console.error("Delete project error:", result.error);
        alert(`Failed to delete project: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete project error:", error);
      alert("An error occurred while deleting the project.");
    }
  };

  const handleArchive = async () => {
    if (!projectDetails) return;
  
    try {
      // Determine the API endpoint based on the current archived status
      const apiEndpoint = projectDetails.isarchived
        ? "http://localhost:5001/unarchiveProject"
        : "http://localhost:5001/archiveProject";
  
      // Make the API call to toggle the archive status
      const toggleResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorusername: projectDetails.creatorusername,
          title: projectDetails.title,
        }),
      });
  
      const result = await toggleResponse.json();
  
      if (toggleResponse.ok) {
        alert(`Project ${projectDetails.isarchived ? "unarchived" : "archived"} successfully!`);
  
        // Update the project details to reflect the new archive state
        setProjectDetails({
          ...projectDetails,
          isarchived: !projectDetails.isarchived, // Toggle the boolean value
        });
      } else {
        console.error(`Failed to toggle archive state: ${result.error}`);
        alert(`Failed to ${projectDetails.isarchived ? "unarchive" : "archive"} project.`);
      }
    } catch (error) {
      console.error(`Error toggling archive state: ${error}`);
      alert("An error occurred while toggling the archive state.");
    }
  };

  const sendNotif = async (toUser: string | null, projectTitle: string | null, messageType: string | null) => {
    const cookieUsername = getUsernameFromCookie();
    if (!toUser || !messageType) return;
    try {
      const response = await fetch("http://localhost:5001/sendNotification", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          touserid: toUser, 
          fromuserid: cookieUsername,
          messagetype: messageType,
          projectitle: projectTitle
        }),
      });
      const data = await response.json();
      if (data.status == 'error') {
        throw new Error(`HTTP error! status: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching sending notification:", error);
    }
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
            <h3>Tag:</h3>
            <p className="creator-name"> {projectDetails.tag}</p>
            {/* <button className="view-profile-button">View Creator Profile</button>
            <button className="current-members-button">Current Members</button> */}
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
                  <h2>Archived</h2>
                  <p>{projectDetails.isarchived ? "Yes" : "No"}</p>
                  <h3>Description</h3>
                  <p>{projectDetails.description || "No description"}</p>
                  <h3>Links</h3>
                  <p>{projectDetails.links || "No links provided"}</p>
                  <div className="spacer"></div>
                  {userRole === "general" && (
                    <div className="buttonContainer">
                      <button className="requestJoinButton" 
                        onClick={(e) => {
                          e.stopPropagation();
                          sendNotif(projectDetails.creatorusername,projectDetails.title, "Join");
                          setRequestSent(true);
                        }}
                      > {requestSent ? "Requested" : "Request Join"} </button>
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
              <button
                className="archiveButton"
                onClick={handleArchive}
              >
                {projectDetails.isarchived ? "Unarchive" : "Archive"}
              </button>
              <button className="deleteButton" onClick={handleDeleteProject}>Delete</button>
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