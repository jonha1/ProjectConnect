"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as filledBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import Navbar from "../../components/navbar";
import "../../styles/project_view.css";
import { getUsernameFromCookie } from "../../lib/cookieUtils";
import Cookies from "js-cookie";


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
  contact: string;
}

type UserRole = "general" | "member" | "creator";

type AutoResizeTextareaProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function AutoResizeTextarea({ placeholder, value, onChange }: AutoResizeTextareaProps) {
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
        color: "black",
      }}
      required
    />
  );
}

interface APIResponse {
  project: ProjectDetails;
}



export default function ProjectView() {
  const [activeTab, setActiveTab] = useState<"everyone" | "members">("everyone");
  const [isBookmarked, setIsBookmarked] = useState<boolean | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [isLoading, setIsLoading] = useState(true);
  const [creator, setCreator] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [requestSent, setRequestSent] = useState(false);
  const [tempProjectDetails, setTempProjectDetails] = useState<ProjectDetails | null>(null);
  const pathname = usePathname(); // Get the current route's pathname
  const [textareaValue, setTextareaValue] = useState(""); 
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false); // Separate state for Invite modal

  // Function to open the Invite modal
  const openInviteModal = () => {
    setIsInviteModalVisible(true);
  };

  // Function to close the Invite modal
  const closeInviteModal = () => {
    setIsInviteModalVisible(false);
  };

  // Extract creatorUsername and title from pathname and fetch project info
  useEffect(() => {
    const cookieUsername = getUsernameFromCookie() || null; // Convert null to undefined
    if (pathname) {
      const urlParams = new URLSearchParams(window.location.search);
      const creator = urlParams.get("creator");
  
      setCreator(creator);
      let projectTitle = urlParams.get("title");
      setTitle(projectTitle);
      if (projectTitle) {
        projectTitle = decodeURIComponent(projectTitle);
      }
      fetchProjectInformation(creator, projectTitle);
      verifyBookmark(creator, projectTitle, cookieUsername); // Pass `cookieUsername` as `string | null`
      verifyNotif(creator, cookieUsername, projectTitle, "Join");
    }
  }, [pathname]);

  useEffect(() => {
    if (projectDetails) {
      const currentUsername: string | null = getUsernameFromCookie() || null;
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

    // Check for HTTP errors
    if (!response.ok) {
      console.error("HTTP error:", response.statusText);
      setUserRole("general");
      return;
    }

    const data = await response.json();
    console.log("Response data:", data);

    // Determine user role based on response message
    if (data.message.includes("is in the project")) {
      setUserRole("member"); // Set role to member
    } else if (data.message.includes("is not in the project")) {
      setUserRole("general"); // Set role to general
    } else {
      console.error("Unexpected response message:", data.message);
      setUserRole("general");
    }
  } catch (error) {
    console.error("Critical error verifying membership:", error);
    setUserRole("general"); // Fallback to general on error
  } finally {
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

  const verifyBookmark = async (creator: string | null, projectTitle: string | null, user: string | null) => {
    try {
        // Ensure projectTitle is not null, use a default value if it is
        const sanitizedTitle = projectTitle ? projectTitle.replace(/-/g, " ") : "";
        const response = await fetch("http://localhost:5001/verifyBookmark", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                creatorusername: creator,
                title: sanitizedTitle,
                username: user,
            }),
        });

        const data = await response.json();
        setIsBookmarked(data.result);
    } catch (error) {
        console.error("Error verifying bookmark:", error);
    }
  };



  const addBookmark = async (creator: string | null, projectTitle: string | null) => {
    const cookieUsername = getUsernameFromCookie();
    if (!creator || !projectTitle) return;
    try {
      const sanitizedTitle = projectTitle ? projectTitle.replace(/-/g, " ") : "";
      const response = await fetch("http://localhost:5001/addBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: sanitizedTitle,
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
      const sanitizedTitle = projectTitle ? projectTitle.replace(/-/g, " ") : "";
      const response = await fetch("http://localhost:5001/deleteBookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          creatorusername: creator, 
          title: sanitizedTitle,
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

  const verifyNotif = async (toUser: string | null, fromUser: string | null, projectTitle: string | null, messageType: string | null) => {
    try {
        // Ensure projectTitle is not null, use a default value if it is
        const sanitizedTitle = projectTitle ? projectTitle.replace(/-/g, " ") : "";

        const response = await fetch("http://localhost:5001/verifyNotif", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                touserid: toUser,
                fromuserid: fromUser,
                messagetype: messageType,
                projectitle: sanitizedTitle,
            }),
        });
        const data = await response.json();
        setRequestSent(data.result);
    } catch (error) {
        console.error("Error verifying bookmark:", error);
    }
  };

  const sendNotif = async (toUser: string | null, projectTitle: string | null, messageType: string | null) => {
    const cookieUsername = getUsernameFromCookie();
    if (!toUser || !messageType || !projectTitle) return; // Check for null projectTitle
    try {
        const sanitizedTitle = projectTitle.replace(/-/g, " "); // Safe to call .replace now

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
                projectitle: sanitizedTitle,
            }),
        });

        const data = await response.json();
        if (data.status == 'error') {
            throw new Error(`HTTP error! status: ${data.error}`);
        }
        alert(data.result);
    } catch (error) {
        console.error("Error fetching sending notification:", error);
    }
  };

  const handleLeaveProject = async () => {
    if (!projectDetails) return;
  
    const { title } = projectDetails;
    const currentUsername = Cookies.get("username");
  
    try {
      const response = await fetch("http://localhost:5001/api/leave-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUsername,
          project_title: title,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(`Successfully left the project: ${title}`);
        // Redirect user to another page or refresh the project list
        window.location.href = "/";
      } else {
        alert(`Error leaving project: ${result.error}`);
      }
    } catch (error) {
      console.error("Error leaving project:", error);
      alert("An error occurred while leaving the project.");
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

  const handleSave = async () => {
    if (!tempProjectDetails) return;
  
    try {
      const { creatorusername, title, ...updates } = tempProjectDetails;
  
      const response = await fetch("http://localhost:5001/updateProjectDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorusername,
          title,
          updates,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setProjectDetails(tempProjectDetails); // Update the main details
        setIsModalVisible(false); // Close the modal
      } else {
        console.error("Error updating project details:", result.message);
      }
    } catch (error) {
      console.error("Error updating project details:", error);
    }
  };
  
  const handleClose = () => {
    setTempProjectDetails(null); // Discard changes
    setIsModalVisible(false); // Close the modal
  };

  const handleEditClick = () => {
    setTempProjectDetails({ ...projectDetails }); // Clone current details
    setIsModalVisible(true);
  };
  
  
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ width: "100vw", height: "100vh" }}
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

  const handleInvite = async (username: string | null, title: string | null) => {
    sendNotif(username, title, "Invite");
  };

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

            <p className="creator-name">{projectDetails.tag}</p>
            <button className="view-profile-button" onClick={() => {
              const currentUsername = Cookies.get("username");
              if (currentUsername === projectDetails.creatorusername) {
                window.location.href = `/account`;
              } else {
                window.location.href = `/account?username=${projectDetails.creatorusername}`;
              }
            }}>View Creator Profile</button>
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
                  <h2>Contact Information</h2>
                  <p>{projectDetails.contact || "No contact information"}</p>
                  <div className="spacer"></div>
                  {userRole === "general" && !projectDetails.isarchived && (
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
              <button className="archiveButton" onClick={handleArchive}>
                {projectDetails.isarchived ? "Unarchive" : "Archive"}
              </button>
              <button className="deleteButton" onClick={handleDeleteProject}>
                Delete
              </button>
              <button
                className="editButton"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button className="inviteButton" type="button" onClick={openInviteModal}>
                Invite
              </button>
            </div>
          )}
          {isModalVisible && tempProjectDetails && (
            <div
              className="modal fade show"
              id="editAccountModal"
              tabIndex={-1}
              role="dialog"
              aria-labelledby="editAccountModal"
              aria-hidden={!isModalVisible}
              style={{ display: "block" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editAccountModal">
                      Edit Project Details
                    </h5>
                  </div>
                  <div className="modal-body">
                    {[
                      { key: "description" as keyof ProjectDetails, label: "Description" },
                      { key: "links" as keyof ProjectDetails, label: "Links" },
                      { key: "contact" as keyof ProjectDetails, label: "Contact Info" },
                      { key: "memberdescription" as keyof ProjectDetails, label: "Member Description" },
                      { key: "memberlinks" as keyof ProjectDetails, label: "Member Links" },
                      { key: "membercontactinfo" as keyof ProjectDetails, label: "Member Contact Info" },
                    ].map(({ key, label }) => (
                      <div key={key} style={{ marginBottom: "1rem" }}>
                        <label
                          htmlFor={`edit-${key}`}
                          style={{
                            fontWeight: "bold",
                            display: "block",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {label}:
                        </label>
                        <AutoResizeTextarea
                          placeholder={`Edit ${label}`}
                          value={tempProjectDetails[key] !== undefined ? String(tempProjectDetails[key]) : ""}
                          onChange={(value) =>
                            setTempProjectDetails((prev) =>
                              prev ? { ...prev, [key]: value } : prev
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isInviteModalVisible && (
            <div
              className="modal fade show"
              id="InviteModal"
              tabIndex={-1}
              role="dialog"
              aria-labelledby="inviteModalLabel"
              aria-hidden={!isInviteModalVisible}
              style={{ display: "block" }} // Ensure visibility matches modal state
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="inviteModalLabel">
                      Invite a User
                    </h5>
                  </div>
                  <div className="modal-body">
                    {/* Invite Textarea */}
                    <AutoResizeTextarea
                      placeholder="Enter a username to invite"
                      value={textareaValue}
                      onChange={(value) => setTextareaValue(value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeInviteModal} // Close modal without action
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(event) => {
                        event.preventDefault();
                        handleInvite(textareaValue, projectDetails?.title || null); // Send invite
                        closeInviteModal(); // Close the modal
                      }}
                    >
                      Send Invite
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {userRole === "member" && (
            <div className="buttonContainer">
              <button className="leaveButton" onClick={handleLeaveProject}>
                Leave Project
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );  
}
