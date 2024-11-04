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
import React, { useState } from "react";

export default function Navbar() {
  // Sample notifications array
  const [notifications, setNotifications] = useState([
    { id: 1, type: "Project Join Request", username: "SpicyDoritos", project: "Medical AI"},
    { id: 2, type: "Request Denied", username: "TornadoMan", project: "Bench Woodmaking" },
    { id: 3, type: "Project Invite Request", username: "John Smith", project: "Archaeologist Trip" },
    { id: 4, type: "Invite Accepted", username: "HelloKittyGirl", project: "Art Mural" },
    { id: 5, type: "Project Join Request", username: "Shaggy", project: "Eat Mountain"},
    { id: 6, type: "Project Join Request", username: "Scooby", project: "Fart Bomb"},
  ]);
  
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to remove a notification by id
  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
              <li className="nav-item" key="bookmark-icon">
                <a className="nav-link navbarComponent" href="#">
                  <FontAwesomeIcon icon={faBookmark} />
                </a>
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