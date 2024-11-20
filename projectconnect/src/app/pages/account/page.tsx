"use client";
import React, { useEffect } from 'react';
import { useState } from "react";
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Postcard from "../../components/post_card";
import styles from "../../styles/searchpage.module.css"; 
import { useSearchParams } from "next/navigation"; 
import { getUsernameFromCookie } from "../../lib/cookieUtils"; 
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const cookieUsername = getUsernameFromCookie(); 
    if (cookieUsername) {
      setUsername(cookieUsername); 

      const fetchUserData = async () => {
        try {
          setIsLoading(true);

          // Fetch user details
          const userResponse = await fetch("http://127.0.0.1:5001/api/getUserDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: cookieUsername }),
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
            body: JSON.stringify({ creatorusername: cookieUsername }),
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
        console.log(data);
        // Transform the response data to match Postcard prop structure
        const transformedData = data.map((item) => ({
          postName: item.title, // Use `title` for postName
          postInfo: item.description, // Use `description` for postInfo
          creatorName: item.creatorusername, // Use `creatorusername` for creatorName
        }));

        setBookmarks(transformedData); // Update the state with transformed data    
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();

  }, []);  
  const postsCreated = [
    {
      postName: "ProjectConnect",
      postInfo:
        "Here would be the descriptions of project that shouldn't be too long. The next few are unfortunately AI-generated.",
      creatorName: "SuaveSailor",
    },
    {
      postName: "ConnectHub",
      postInfo:
        "ConnectHub is a project management tool that helps remote teams stay organized and connected. With task management, team chat, and file sharing capabilities, ConnectHub streamlines collaboration for distributed teams. Built using React for the frontend and Firebase for real-time updates, ConnectHub keeps remote teams aligned and productive.",
      creatorName: "SuaveSailor",
    },
    {
      postName: "MarketPlacePro",
      postInfo:
        "MarketPlacePro is a customizable e-commerce platform designed for small business owners looking to take control of their online sales. Featuring product management, a payment gateway, and analytics, this platform enables users to create their own online stores. MarketPlacePro was developed with a Vue.js frontend, Django backend, and integrates Stripe for secure payments.",
      creatorName: "SuaveSailor",
    },
    {
      postName: "StudySphere",
      postInfo:
        "StudySphere is an online platform for student study groups, allowing users to form groups, schedule study sessions, and access resources for shared learning. Built using Angular and Firebase, StudySphere enables real-time collaboration and resource sharing, making study sessions accessible to students anytime, anywhere.",
      creatorName: "SuaveSailor",
    },
    {
      postName: "Eventory",
      postInfo:
        "Eventory is a mobile-first app that lets users discover local events and activities tailored to their interests. With a focus on location-based services, Eventory uses React Native for the frontend, Node.js for backend operations, and MongoDB to store event data. The app provides an interactive map feature for finding events close to the user’s current location.",
      creatorName: "SuaveSailor",
    },
    {
      postName: "GreenSpace",
      postInfo:
        "GreenSpace is an environmental app aimed at promoting eco-friendly practices within communities. Users can log sustainable actions, track personal impact, and connect with others in green initiatives. Developed with Svelte for the user interface, Node.js for the backend, and PostgreSQL for data storage, GreenSpace encourages community-led environmental change.",
      creatorName: "SuaveSailor",
    },
  ];

  const postsJoined = [
    {
      postName: "SkillBridge",
      postInfo: "SkillBridge is a mentorship platform connecting students and young professionals with industry experts for career guidance and skill development. The app offers mentorship matchmaking, one-on-one video sessions, and progress tracking features. Built with a Next.js frontend, Django REST API, and PostgreSQL database, SkillBridge supports meaningful mentorship connections across various industries.",
      creatorName: "Swagalicious995"
    },
    {
      postName: "Nexxus Connect",
      postInfo:
        "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o",
    },
    {
      postName: "Insightify",
      postInfo:
        "Insightify is a data visualization tool built for small business owners and analysts who need intuitive, real-time insights into their operations. This project processes data from various sources, such as sales, customer feedback, and inventory, and visualizes key trends using dynamic graphs and charts. With a sleek React UI, Express for API handling, and D3.js for interactive charts, Insightify offers actionable insights at a glance, simplifying decision-making for business growth.",
      creatorName: "ChatGPT 4o",
    },
    {
      postName: "PathFinder",
      postInfo:
        "PathFinder is a career planning and mentorship platform designed to connect students and recent graduates with mentors in their desired fields. Users can create profiles, browse career paths, access mentorship resources, and engage in direct messaging with mentors. The project combines React for user interfaces, Node.js for backend services, and PostgreSQL to store user profiles and career data. PathFinder aims to make career guidance accessible and tailored to individual aspirations.",
      creatorName: "ChatGPT 4o",
    },
    {
      postName: "ProjectConnect",
      postInfo:
        "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995",
    },
    {
      postName: "Nexxus Connect",
      postInfo:
        "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o",
    },
  ];

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
          style={{ width: "5rem", height: "5rem" , color: "#2D2D2D" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  {postsCreated.map((post, index) => (
    <Postcard
      key={index}
      postName={post.title || "Untitled"} 
      postInfo={post.description || "No description available"}
      creatorName={post.creatorusername || "Unknown creator"}
      className={styles.postCard}
    />
  ))}

  const handleEdit = (component: string) => {
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
      const response = await fetch('http://localhost:5001/updateProfileFromEdit', {
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
                  {bookmarks.map((post, index) => (
                    <Postcard
                      key={index}
                      postName={post.postName}
                      postInfo={post.postInfo}
                      creatorName={post.creatorName}
                      className={styles.postCard} // Apply class to each card
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
