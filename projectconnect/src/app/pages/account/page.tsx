"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Postcard from "../../components/post_card";
import styles from "../../styles/searchpage.module.css";
import { getUsernameFromCookie } from "../../lib/cookieUtils";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface Project {
  creatorusername: string;
  title: string;
  description: string;
  links: string;
  memberDescription: string;
  memberLinks: string;
  memberContactInfo: string;
  dateposted: string;
  isarchived: boolean;
}

interface Bookmark {
  postName: string;
  postInfo: string;
  creatorName: string;
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

export default function Account() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("created"); // Default to "created"
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("Loading...");
  const [aboutMe, setAboutMe] = useState("Loading...");
  const [contactInfo, setContactInfo] = useState("Loading...");
  const [postsCreated, setPostsCreated] = useState<Project[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState("Loading...");
  const [editComponent, setEditComponent] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Separate state for Invite modal
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);


  const openEditModal = () => setIsEditModalVisible(true);
  const closeEditModal = () => setIsEditModalVisible(false);
  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryTab = searchParams.get("query");
    if (queryTab === "bookmark") {
      setActiveTab("bookmarks");
    }
  }, []); 


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlUsername = searchParams.get("username");
    const usernameToFetch = urlUsername || getUsernameFromCookie();
    
    setIsOwner(usernameToFetch === getUsernameFromCookie());

    if (usernameToFetch) {
      setUsername(usernameToFetch);

      const fetchData = async () => {
        setIsLoading(true); // Start loading

        const isProduction =
        window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
        const apiUrl = isProduction
          ? "/api"
          : "http://127.0.0.1:5001/api";

        // Define promises for each API call
        const fetchUserDetails = fetch(`${apiUrl}/getUserDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: usernameToFetch }),
        })
          .then((res) => res.json())
          .then((userResult) => {
            setDisplayName(userResult.displayname || "No displayName found");
            setAboutMe(userResult.aboutme || "No About Me information found.");
            setContactInfo(userResult.contactinfo || "No Contact information found.");
            setSkills(userResult.skills || "No skills found.");
          })
          .catch((error) => {
            console.error("Error fetching user details:", error);
          });

        const fetchCreatedPosts = fetch(`${apiUrl}/projects/by_creator`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ creatorusername: usernameToFetch }),
        })
          .then((res) => res.json())
          .then((postsResult) => {
            setPostsCreated(postsResult.projects || []);
          })
          .catch((error) => {
            console.error("Error fetching projects:", error);
          });

        const fetchJoinedProjects = fetch(`${apiUrl}/projects/by_member`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: usernameToFetch }),
        })
          .then((res) => res.json())
          .then((result) => {
            setJoinedProjects(result.projects || []);
          })
          .catch((error) => {
            console.error("Error fetching joined projects:", error);
          });

        const fetchBookmarks = fetch(`${apiUrl}/retrieveBookmarks`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: usernameToFetch }),
        })
          .then((res) => res.json())
          .then((data) => {
            const transformedData = data.bookmarks.map(
              (item: { title: string; description: string; creatorusername: string }): Bookmark => ({
                postName: item.title,
                postInfo: item.description,
                creatorName: item.creatorusername,
              })
            );
            setBookmarks(transformedData);
          })
          .catch((error) => {
            console.error("Error fetching bookmarks:", error);
          });

        // Wait for all promises to resolve
        await Promise.all([fetchUserDetails, fetchCreatedPosts, fetchJoinedProjects, fetchBookmarks]);

        setIsLoading(false); // End loading when all data is fetched
      };

      fetchData();
    } else {
      setAboutMe("Username not found.");
      setDisplayName("DisplayName not found");
      setContactInfo("Username not found.");
      setSkills("Username not found.");
      setIsLoading(false);
    }
  }, []);



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

  {
    postsCreated.map((post, index) => (
      <Postcard
        key={index}
        postName={post.title || "Untitled"}
        postInfo={post.description || "No description available"}
        creatorName={post.creatorusername || "Unknown creator"}
        className={styles.postCard}
      />
    ))
  }

  const handleEdit = (component: string) => {
    openEditModal();
    setEditComponent(component);

    // Set the initial value based on the component being edited
    switch (component) {
      case "About Me":
        setTextareaValue(aboutMe);
        break;
      case "Contact Information":
        setTextareaValue(contactInfo);
        break;
      case "Skills":
        setTextareaValue(skills);
        break;
      default:
        setTextareaValue("");
    }
  };

  const updateProfile = async (
    username: string,
    column: string,
    value: string
  ): Promise<void> => {
    try {
      const isProduction =
        window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
        const apiUrl = isProduction
          ? "/api"
          : "http://127.0.0.1:5001/api";

      const response = await fetch(`${apiUrl}/updateProfileFromEdit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          column: column,
          value: value,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`Failed to update ${column}:`, result.error || result.message);
      }
    } catch (error) {
      console.error(`Error updating ${column}:`, error);
    }
  };


  const handleSave = () => {
    closeEditModal();
    // Save the updated value based on the `editComponent`
    let columnToEdit = "";
    switch (editComponent) {
      case "About Me":
        setAboutMe(textareaValue);
        columnToEdit = "aboutme";
        break;
      case "Contact Information":
        setContactInfo(textareaValue);
        columnToEdit = "contactinfo";
        break;
      case "Skills":
        setSkills(textareaValue);
        columnToEdit = "skills";
        break;
      default:
        break;
    }

    updateProfile(username, columnToEdit, textareaValue);
  };

  const login = () => {
    //logs out of account completly with cookie , and reroute to login page
    Cookies.remove('username');
    Cookies.remove('email');
    router.push("/login");
  };


  return (
    <div className="wrapper">
      <Navbar />

      <div className="contentContainer">
        <div className="sidePanel">
          <div className="displayName">{displayName}</div>
          <div className="userName">
            {username}</div>
          <div className="profileCard">
            About Me: {aboutMe}
            {isOwner && <FontAwesomeIcon onClick={() => handleEdit("About Me")} icon={faPencil} role='button' className="editIcon"/>}
          </div>
          <div className="profileCard">
            <p>Contact Information: {contactInfo}</p>
            {isOwner && <FontAwesomeIcon onClick={() => handleEdit("Contact Information")} icon={faPencil} role='button' className="editIcon"/>}
          </div>
          <div className="profileCard">
            Skills: {skills} 
            {isOwner && <FontAwesomeIcon onClick={() => handleEdit("Skills")} icon={faPencil} role='button' className="editIcon"/>}
          </div>

          {isEditModalVisible && (
            <div
              className="modal fade show"
              role="dialog"
              tabIndex={-1}
              aria-hidden={!isEditModalVisible}
              style={{
                display: "block",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
                zIndex: 1040, // Match Bootstrap modal z-index
              }}
              aria-labelledby="editAccountModal"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editAccountModal">Edit {editComponent}</h5>
                  </div>
                  <div className="modal-body">
                    <AutoResizeTextarea
                      placeholder={`Edit ${editComponent}`}
                      value={textareaValue}
                      onChange={(value) => setTextareaValue(value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isOwner && (
            <button
              type="button"
              className="btn custom-logout-btn btn-sm"
              onClick={showLogoutModal}
            >
              Logout
            </button>
          )}
          {isLogoutModalVisible && (
            <div
              className="modal fade show"
              role="dialog"
              tabIndex={-1}
              style={{
                display: "block",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
                zIndex: 1040, // Match Bootstrap modal z-index
              }}
              aria-labelledby="logoutModal"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="logoutbtnLabel">
                      Confirm Logout
                    </h5>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to log out?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={hideLogoutModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={login}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      <div className="mainContent">
        <div className={`tabs`}>
          <div
            className={activeTab === "created" ? "activeTab" : ""}
            onClick={() => setActiveTab("created")}
          >
            Created Projects
          </div>
          <div
            className={activeTab === "joined" ? "activeTab" : ""}
            onClick={() => setActiveTab("joined")}
          >
            Joined Projects
          </div>
          {isOwner && 
            <div
              className={activeTab === "bookmarks" ? "activeTab" : ""}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </div>
          }   
        </div>

        <div className="projects">
          {activeTab === "created" && (
            <div className="createdProjects">
              <div className={styles.postContainer}>
                {postsCreated.length > 0 ? (
                  postsCreated.map((post, index) => (
                    <Postcard
                      key={index}
                      postName={post.title}
                      postInfo={post.description}
                      creatorName={post.creatorusername}
                      className={styles.postCard}
                    />
                  ))
                ) : (
                  <p>No created projects found.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "joined" && (
            <div className="joinedProjects">
              <div className={styles.postContainer}>
                {joinedProjects.length > 0 ? (
                  joinedProjects.map((project, index) => (
                    <Postcard
                      key={index}
                      postName={project.title}
                      postInfo={project.description}
                      creatorName={project.creatorusername}
                      className={styles.postCard}
                    />
                  ))
                ) : (
                  <p>No joined projects found.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "bookmarks" && (
            <div className="bookmarks">
              <div className={styles.postContainer}>
                {bookmarks.length > 0 ? (
                  bookmarks.map((post, index) => (
                    <Postcard
                      key={index}
                      postName={post.postName}
                      postInfo={post.postInfo}
                      creatorName={post.creatorName}
                      className={styles.postCard} // Apply class to each card
                    />
                  ))
                ) : (
                  <p>No Bookmarked posts found. </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      </div >
      );
}

