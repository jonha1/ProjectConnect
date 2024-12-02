"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getUsernameFromCookie } from "../lib/cookieUtils";

interface Notification {
  notificationid: string;
  messagetype: string;
  fromuserid: string;
  title: string;
  creator: string
}

interface TransformedNotification {
  id: number; 
  type: string;
  username: string;
  project: string;
  creator: string;
}

export default function Navbar() {
  const [notifications, setNotifications] = useState<TransformedNotification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Helper function to normalize string | null to string | undefined
  const normalizeString = (value: string | undefined): string | undefined => value ?? undefined;

  useEffect(() => {
    const cookieUsername = normalizeString(getUsernameFromCookie()); // Normalize cookie username
    fetchNotifs(cookieUsername);
  }, []);

  // Fetch notifications for the logged-in user
  const fetchNotifs = async (user: string | undefined) => {
    try {
      const isProduction =
      window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? "/api"
        : "http://127.0.0.1:5001/api";

      const response = await fetch(`${apiUrl}/retrieveNotifications`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: Notification[] = await response.json();
      const transformedData: TransformedNotification[] = data.map((item) => ({
        id: Number(item.notificationid), // Convert id to number
        type: item.messagetype,
        username: item.fromuserid,
        project: item.title,
        creator: item.creator
      }));
      setNotifications(transformedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Remove notification locally
  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  // Accept a notification
  const acceptNotifs = async (notifId: number) => {
    try {
      const isProduction =
      window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? "/api"
        : "http://127.0.0.1:5001/api";
      
      const response = await fetch(`${apiUrl}/acceptNotification"`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationid: notifId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      removeNotification(notifId); // Remove notification after accepting
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  };

  // Remove a notification from the server and locally
  const rejectNotifs = async (notifId: number) => {
    try {
      const isProduction =
      window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? "/api"
        : "http://127.0.0.1:5001/api";
      
      const response = await fetch(`${apiUrl}/rejectNotification"`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationid: notifId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      removeNotification(notifId); // Remove notification locally
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
              <li
                className="nav-item"
                key="bell-icon"
                onClick={toggleDropdown}
                style={{ position: "relative" }}
              >
                <a className="nav-link navbarComponent" href="#">
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.length > 0 && (
                    <span className="notificationCountBadge">{notifications.length}</span>
                  )}
                </a>
                {isDropdownOpen && (
                  <div className="notificationDropdown">
                    <div className="notificationTitle">Notifications</div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="notificationItem">
                          <div className="notificationText">
                            {notification.type}:
                            <br />
                            <a href={`/account?username=${notification.username}`} className="username">
                              {notification.username}
                            </a>{" "}
                            <a href={`/post?creator=${notification.creator}&title=${notification.project}`} className="projectName">
                              ({notification.project})
                            </a>
                          </div>
                          <div className="iconContainer">
                            {["Join", "Invite"].includes(notification.type) && (
                              <div className="iconButton">
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    acceptNotifs(notification.id);
                                  }}
                                />
                              </div>
                            )}
                            <div
                              className="iconButton"
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectNotifs(notification.id);
                              }}
                            >
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
