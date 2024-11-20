"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBell,
  faBookmark,
  faUser,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.modules.css";
import "../styles/notifications.css"; 
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsernameFromCookie } from "../lib/cookieUtils";

export default function Navbar() {
  // Sample notifications arrayx
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  // const [notifications, setNotifications] = useState([
  //   { id: 1, type: "Project Join Request", username: "SpicyDoritos", project: "Medical AI"},
  //   { id: 2, type: "Request Denied", username: "TornadoMan", project: "Bench Woodmaking" },
  //   { id: 3, type: "Project Invite Request", username: "John Smith", project: "Archaeologist Trip" },
  //   { id: 4, type: "Invite Accepted", username: "HelloKittyGirl", project: "Art Mural" },
  //   { id: 5, type: "Project Join Request", username: "Shaggy", project: "Eat Mountain"},
  //   { id: 6, type: "Project Join Request", username: "Scooby", project: "Fart Bomb"},
  // ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const cookieUsername = getUsernameFromCookie(); // Retrieve the username from the cookie
    if (cookieUsername) {
      setUsername(cookieUsername); // Set the username in state
    }
    console.log("in the useEffect");
    // const fetchNotifs = async () => {
    //   try {
    //     const response = await fetch("http://localhost:5001/retrieveNotifications", {
    //       method: "POST",
    //       credentials: "include",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ username: cookieUsername }),
    //     });
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     console.log(data);
    //     // Transform the response data to match Postcard prop structure
    //     // const transformedData = data.map((item) => ({
    //     //   postName: item.title, // Use `title` for postName
    //     //   postInfo: item.description, // Use `description` for postInfo
    //     //   creatorName: item.creatorusername, // Use `creatorusername` for creatorName
    //     // }));

    //     setNotifications(data); // Update the state with transformed data    
    //   } catch (error) {
    //     console.error("Error fetching bookmarks:", error);
    //   }
    // };
    // fetchNotifs();
  }, []);  
  // Function to remove a notification by id
  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const router = useRouter();
  const handleBookmarkClick = () => {
      router.push("/account?query=bookmark");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary navbarClass">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <h2 className="navbarTitle">ProjectConnect</h2>
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item" key="plus-icon">
                <a className="nav-link navbarComponent" aria-current="page" href="/createproject">
                  <FontAwesomeIcon icon={faPlus} />
                </a>
              </li>
              <li className="nav-item" key="bookmark-icon">
                <a className="nav-link navbarComponent" onClick={handleBookmarkClick}>
                  <FontAwesomeIcon icon={faBookmark} />
                </a>
              </li>
              <li className="nav-item" key="bell-icon" onClick={toggleDropdown} style={{ position: 'relative' }}>
                <a className="nav-link navbarComponent" href="#">
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.length > 0 && (
                      <span className="notificationCountBadge">{notifications.length}</span>
                    )}
                </a>
                {isDropdownOpen && (
                  <div className="notificationDropdown">
                    {/* Notifications Title */}
                    <div className="notificationTitle">Notifications</div>
                    
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div key={notification.id} className="notificationItem">
                          {/* Display Notification Type, Username, and Project */}
                          <div className="notificationText">
                          {notification.type}:
                            <br />
                            <a href={`/profile/${notification.username}`} className="username">
                              {notification.username}
                            </a> <>  </>    
                            <a href={`/project/${notification.project}`} className="projectName">
                              ({notification.project})
                            </a> 
                          </div>

                          {/* Icons for actionable and dismissible notifications */}
                          <div className="iconContainer">
                            {/* Show the check and X icons for actionable notifications */}
                            {(notification.type === "Project Join Request" || notification.type === "Project Invite Request") && (
                              <>
                                <div className="iconButton">
                                  <FontAwesomeIcon icon={faCheck} onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}/>
                                </div>
                              </>
                            )}
                            {/* Show only the X icon for dismissing all types */}
                            <div className="iconButton" onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}>
                              <FontAwesomeIcon icon={faTimes} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="noNotifications">No new notifications</p>
                    )}
                  </div>
                )}
              </li>
              <li className="nav-item" key="user-icon">
                <a className="nav-link navbarComponent" href="/account">
                  <FontAwesomeIcon icon={faUser} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}