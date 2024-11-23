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

type AutoResizeTextareaProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function AutoResizeTextarea({ placeholder, value, onChange }: AutoResizeTextareaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';  
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
        width: '100%',
        minHeight: '50px',
        resize: 'none',
        overflow: 'hidden',
        color: 'black',
      }}
      required
    />
  );
}

// Props for the component
type ProjectViewProps = {
  userRole: "general" | "member" | "creator";
};

export default function ProjectView({ userRole }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState<"everyone" | "members">("everyone");
  const [isBookmarked, setIsBookmarked] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [creator, setCreator] = useState("");
  const [title, setTitle] = useState("");
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [textareaValue, setTextareaValue] = useState(""); 

  const pathname = usePathname(); // Get the current route's pathname

  // Extract creatorUsername and title from pathname and fetch project info
  useEffect(() => {
    const cookieUsername = getUsernameFromCookie(); // Retrieve the username from the cookie
    if (pathname) {
      const urlParams = new URLSearchParams(window.location.search);
      const creator = urlParams.get("creator");
      setCreator(creator);

      let projectTitle = urlParams.get("title");

      if (projectTitle) {
        projectTitle = projectTitle.replace("-", " ");
      }

      fetchProjectInformation(creator, projectTitle);
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
          title: projectTitle.replace("-", " "),
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
          title: projectTitle.replace("-", " "),
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
          title: projectTitle.replace("-", " "),
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
          projectitle: projectTitle.replace("-", " ")
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

  const handleInvite = async (username: string | null, title: string | null) => {
    sendNotif(username, title, "Invite");
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "100vh" }}>
        <div className="spinner-border" role="status" style={{ width: "5rem", height: "5rem", color: "#2D2D2D"}}>
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
              <button className="archiveButton">Archive</button>
              <button className="deleteButton">Delete</button>
              <button className="editButton">Edit</button>
              <button className="inviteButton" type="button" data-bs-toggle="modal" data-bs-target="#InviteModal">
                Invite
              </button>

              <div className="modal fade" id="InviteModal" tabIndex={-1} role="dialog" aria-labelledby="editAccountModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                    <AutoResizeTextarea
                    placeholder={`Username`}
                    value={textareaValue}
                    onChange={(value) => setTextareaValue(value)}
                  />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" data-bs-dismiss="modal" 
                      onClick={(event)=>{
                        event.preventDefault();
                        handleInvite(textareaValue, projectDetails.title);
                      }}>Invite</button>
                    </div>
                  </div>
                </div>
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