"use client";
import React, { useEffect } from 'react';
import { useState } from "react";
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Postcard from "../../components/post_card";
import styles from "../../styles/searchpage.module.css"; 
import { useSearchParams } from "next/navigation"; 
import { getUsernameFromCookie } from "../../lib/cookieUtils"; 

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

export default function Home() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("query") === "bookmark" ? "bookmarks" : "created";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("Loading...");
  const [displayName, setDisplayName] = useState("Loading...");
  const [aboutMe, setAboutMe] = useState("Loading...");
  const [contactInfo, setContactInfo] = useState("Loading...");
  const [postsCreated, setPostsCreated] = useState<Project[]>([]); 
  const [skills, setSkills] = useState("Loading...");

  const [isLoading, setIsLoading] = useState(true);

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
            setEmail(userResult.loginemail || "No email found.");
            console.log("Email state updated:", email);
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
      setEmail("Username not found.");
      setAboutMe("Username not found.");
      setDisplayName("DisplayName not found");
      setContactInfo("Username not found.");
      setSkills("Username not found.");
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

  const postsBookmarked = [
    {
      postName: "SkillSync",
      postInfo:
        "SkillSync is a platform built for individuals seeking to enhance their skills through real-world projects. Users can create or join projects aligned with their interests, gain hands-on experience, and receive feedback from mentors. The app uses Vue.js for a responsive interface, a Django backend, and integrates with GitHub for project tracking. SkillSync fosters continuous learning and practical application of skills in an immersive, collaborative environment.",
      creatorName: "DevGuru45",
    },
    {
      postName: "EcoHub",
      postInfo:
        "EcoHub is a community-driven app designed for individuals passionate about sustainable living. The app connects users with local events, green initiatives, and eco-friendly businesses. EcoHub was built using Angular for the front end, Node.js for server-side processing, and MongoDB to store user-generated content and event data. With EcoHub, users can find eco-conscious events, share green tips, and contribute to a growing community of environmental advocates.",
      creatorName: "EcoWarrior99",
    },
    {
      postName: "EventLink",
      postInfo:
        "EventLink is an event planning and networking platform where hosts and attendees can connect based on their interests. From concerts to workshops, EventLink offers an intuitive event discovery and RSVP system. Using Svelte for the UI and Firebase for authentication and real-time data sync, EventLink streamlines the event experience by helping people discover and join events they are passionate about.",
      creatorName: "EventMaster00",
    },
    {
      postName: "CodeQuest",
      postInfo:
        "CodeQuest is a coding challenge and skill-building platform designed for developers of all levels. With daily challenges and skill-based leaderboards, users can hone their skills and track progress. CodeQuest utilizes Next.js for fast-loading pages, a Python Flask API, and Redis for caching challenges and leaderboard data. By offering gamified challenges, CodeQuest keeps coding fun and engaging.",
      creatorName: "HackGuru2023",
    },
    {
      postName: "PhotoFusion",
      postInfo:
        "PhotoFusion is a social media platform dedicated to photography enthusiasts. Users can create profiles, share photos, participate in photo challenges, and receive feedback. Built with a React frontend, Ruby on Rails backend, and AWS S3 for image storage, PhotoFusion supports high-quality image sharing and engagement. This community-centric app is perfect for aspiring photographers looking to connect and learn from others.",
      creatorName: "ShutterBug101",
    },
    {
      postName: "TutorSphere",
      postInfo:
        "TutorSphere is an online tutoring marketplace that connects students with qualified tutors across a variety of subjects. Tutors can create profiles, list subjects, and set hourly rates, while students can book sessions and leave reviews. Built with a Vue.js frontend, Node.js backend, and PostgreSQL database, TutorSphere aims to make quality tutoring accessible and customizable to individual learning needs.",
      creatorName: "EduCoach88",
    },
  ];

  return (
    <div className="wrapper">
      <Navbar />

      <div className="contentContainer">
        <div className="sidePanel">
          <div className="displayName">{displayName}</div>
          <div className="userName">{username}</div>
          <div className="profileCard">
            About Me: {aboutMe}
          </div>
          <div className="profileCard">
            <p>Contact Information: {contactInfo} </p>
          </div>
          <div className="profileCard">Skills: {skills}</div>
          <div className="buttonContainer">
            <button type="button" className="btn profileActionButtons">
              Edit Profile
            </button>
            <button type="button" className="btn profileActionButtons">
              Settings
            </button>
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
                <div className={styles.postContainer}>
                  {postsJoined.map((post, index) => (
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
            {activeTab === "bookmarks" && (
              <div className="bookmarks">
                <div className={styles.postContainer}>
                  {postsBookmarked.map((post, index) => (
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
