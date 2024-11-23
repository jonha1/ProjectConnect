"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Postcard from "../../components/post_card";
import styles from "../../styles/searchpage.module.css";
import { useSearchParams } from "next/navigation";
import { getUsernameFromCookie } from "../../lib/cookieUtils";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Define types for projects and bookmarks
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

export default function Account() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("query") === "bookmark" ? "bookmarks" : "created";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("Loading...");
  const [aboutMe, setAboutMe] = useState("Loading...");
  const [contactInfo, setContactInfo] = useState("Loading...");
  const [postsCreated, setPostsCreated] = useState<Project[]>([]);
  const [skills, setSkills] = useState("Loading...");
  const [editComponent, setEditComponent] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlUsername = searchParams.get("username");
    const usernameToFetch = urlUsername || getUsernameFromCookie();

    if (usernameToFetch ) {
      setUsername(usernameToFetch );

      const fetchUserData = async () => {
        try {
          setIsLoading(true);

          // Fetch user details
          const userResponse = await fetch("http://127.0.0.1:5001/api/getUserDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: usernameToFetch }),
          });

          const userResult = await userResponse.json();

          if (userResponse.ok) {
            setDisplayName(userResult.displayname || "No displayName found");
            setAboutMe(userResult.aboutme || "No About Me information found.");
            setContactInfo(userResult.contactinfo || "No Contact information found.");
            setSkills(userResult.skills || "No skills found.");
          } else {
            console.error("Error fetching user details:", userResult.message);
          }

          // Fetch user's created posts
          const postsResponse = await fetch("http://127.0.0.1:5001/projects/by_creator", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ creatorusername: usernameToFetch }),
          });

          const postsResult = await postsResponse.json();

          if (postsResponse.ok) {
            setPostsCreated(postsResult.projects || []);
          } else {
            console.error("Error fetching projects:", postsResult.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };



      const fetchJoinedProjects = async () => {
        try{
          const response = await fetch("http://127.0.0.1:5001/projects/by_member", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: usernameToFetch }),
          });

          const result = await response.json();
          if (response.ok) {
            setJoinedProjects(result.projects || []);
          } else {
            console.error("Error fetching joined projects:", result.message);
          }
        }
        catch (error) {
          console.error("Error fetching joined projects:", error);
        }
      };

      fetchUserData();
    } else {
      console.error("Username not found in cookies.");
      setAboutMe("Username not found.");
      setDisplayName("DisplayName not found");
      setContactInfo("Username not found.");
      setSkills("Username not found.");
    }

    const fetchBookmarks = async () => {
      try {
        const response = await fetch("http://localhost:5001/retrieveBookmarks", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: cookieUsername }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const transformedData = data.bookmarks.map((item: { title: string; description: string; creatorusername: string }): Bookmark => ({
          postName: item.title,
          postInfo: item.description,
          creatorName: item.creatorusername,
        }));
        setBookmarks(transformedData);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "100vh" }}>
        <div className="spinner-border" role="status" style={{ width: "5rem", height: "5rem", color: "#2D2D2D" }}>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const handleEdit = (component: string) => {
    setEditComponent(component);

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

  const updateProfile = async (username: string, column: string, value: string): Promise<void> => {
    try {
      const response = await fetch("http://localhost:5001/updateProfileFromEdit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          column: column,
          value: value,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("updated successfully:", result.message);
      } else {
        console.error(`Failed to update ${column}:`, result.error || result.message);
      }
    } catch (error) {
      console.error(`Error updating ${column}:`, error);
    }
  };

  const handleSave = () => {
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
            <FontAwesomeIcon onClick={() => handleEdit("About Me")} icon={faPencil} role='button' className="editIcon" data-bs-toggle="modal" data-bs-target="#editAccountModal"/>
          </div>
          <div className="profileCard">
            <p>Contact Information: {contactInfo}</p>
            <FontAwesomeIcon onClick={() => handleEdit("Contact Information")} icon={faPencil} role='button' className="editIcon" data-bs-toggle="modal" data-bs-target="#editAccountModal"/>
          </div>
          <div className="profileCard">
            Skills: {skills} 
            <FontAwesomeIcon onClick={() => handleEdit("Skills")} icon={faPencil} role='button' className="editIcon" data-bs-toggle="modal" data-bs-target="#editAccountModal"/>
          </div>

          <div className="modal fade" id="editAccountModal" tabIndex={-1} role="dialog" aria-labelledby="editAccountModal" aria-hidden="true">
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
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>
          </div>
          
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
            <div
              className={activeTab === "bookmarks" ? "activeTab" : ""}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </div>
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
    </div>
  );
}
