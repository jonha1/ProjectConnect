"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import Searchbar from "../../components/searchbar";
import Postcard from "../../components/post_card";
import { useSearchContext } from "../../context/SearchContext";
import styles from "../../styles/searchpage.module.css";


interface Post {
  postName: string;
  postInfo: string;
  creatorName: string;
}

export const dynamic = "force-dynamic";

export default function Search() {
  const { searchText, tag, setSearchText } = useSearchContext(); // Include setTag
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Search context in production:", { searchText, tag });
  }, [searchText, tag]);
  

  const fetchProjects = useCallback(async () => {
    try {
      const isProduction =
        window.location.hostname !== "localhost" && window.location.hostname !== '127.0.0.1';
        const apiUrl = isProduction
          ? "/api"
          : "http://127.0.0.1:5001/api";

      const response = await fetch(`${apiUrl}/findProjects`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery: searchText.trim(),
          tag: tag.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(
          data.map((item) => ({
            postName: item.title || "Untitled",
            postInfo: item.description || "No description available",
            creatorName: item.creatorusername || "Anonymous",
          }))
        );
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchText, tag]); // Include searchText and tag as dependencies

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Add fetchProjects as a dependency


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

  return (
    <>
      <Navbar />
      <Searchbar
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      <div className={styles.postContainer}>
        {posts.map((post, index) => (
          <Postcard
            key={index}
            postName={post.postName}
            postInfo={post.postInfo}
            creatorName={post.creatorName}
            className={styles.postCard}
          />
        ))}
      </div>
    </>
  );
}

