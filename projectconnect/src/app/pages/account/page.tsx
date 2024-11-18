"use client";
import React, { useEffect } from 'react';
import { useState } from "react";
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Postcard from "../../components/post_card";
import styles from "../../styles/searchpage.module.css"; // Import the CSS file for styling
import { useSearchParams } from "next/navigation"; 
import { getUsernameFromCookie } from "../../lib/cookieUtils"; // Adjust the path based on your project structure


export default function Home() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("query") === "bookmark" ? "bookmarks" : "created";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [aboutMe, setAboutMe] = useState("Loading..."); 

  useEffect(() => {
    const cookieUsername = getUsernameFromCookie();
    if (cookieUsername) {
      setUsername(cookieUsername);

      const fetchAboutMe = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5001/api/getAboutMe", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: cookieUsername }),
          });

          const result = await response.json();
          if (response.ok && result.aboutme) {
            setAboutMe(result.aboutme);
          } else {
            setAboutMe("No About Me information found.");
          }
        } catch (error) {
          console.error("Error fetching About Me:", error);
          setAboutMe("Error fetching About Me.");
        }
      };

      fetchAboutMe();
    } else {
      console.error("Username not found in cookies.");
    }
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
          <div className="displayName">William Li</div>
          <div className="userName">{username || "Loading..."}</div>
          <div className="profileCard">
            About Me: {aboutMe}
          </div>
          <div className="profileCard">
            <p>Contact Information: </p>
            <p>Email: temporaryEmail@gmail.com</p>
            <p>LinkedIn: linkedin/temp</p>
          </div>
          <div className="profileCard">Skills: C++, C, Python, Java, React</div>
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
                  {postsCreated.map((post, index) => (
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
