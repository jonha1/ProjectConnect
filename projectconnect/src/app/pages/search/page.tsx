// "use client";
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Navbar from '../../components/navbar';
// import Searchbar from '../../components/searchbar';
// import Postcard from '../../components/post_card';
// import styles from '../../styles/searchpage.module.css';

// export default function Search() {
//   const searchParams = useSearchParams();
//   const initialQuery = searchParams.get("query") || "";
//   const [searchText, setSearchText] = useState(initialQuery);
//   const [posts, setPosts] = useState([
//     {
//       postName: "ProjectConnect",
//       postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortunately AI-generated.",
//       creatorName: "Swagalicious995"
//     },
//     {
//       postName: "Nexxus Connect",
//       postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals...",
//       creatorName: "ChatGPT 4o"
//     },
//     {
//       postName: "Insightify",
//       postInfo: "Insightify is a data visualization tool built for small business owners and analysts...",
//       creatorName: "ChatGPT 4o"
//     },
//     {
//       postName: "PathFinder",
//       postInfo: "PathFinder is a career planning and mentorship platform designed to connect students...",
//       creatorName: "ChatGPT 4o"
//     }
//   ]);

//   const handleSearchChange = (query: string) => {
//     setSearchText(query);
//   };

//   const fetchProjects = async () => {
//     try {
//       const response = await fetch("http://localhost:5001/findProjects", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           searchQuery: searchText,  // Use the current search text as the query
//           tags: "",                 // Set tags and filter as needed
//           filter: ""
//         }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const data = await response.json();
  
//       // Update posts state with fetched projects
//       if (Array.isArray(data)) {
//         console.log(data)
//         setPosts(data);  // Set the posts state with the new data array
//       } else {
//         console.log("No projects found or an error occurred.");
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };

//   // Run fetchProjects when the component mounts or searchText changes
//   useEffect(() => {
//     if (initialQuery) {
//       setSearchText(initialQuery);
//     }
//     fetchProjects();  // Fetch projects when searchText or query changes
//   }, [searchText, initialQuery]);

//   return (
//     <>
//       <Navbar />
//       <Searchbar searchText={searchText} onSearchChange={handleSearchChange} />
//       <div className={styles.postContainer}>
//         {posts.map((post, index) => (
//           <Postcard
//             key={index}
//             postName={post.postName}
//             postInfo={post.postInfo}
//             creatorName={post.creatorName}
//             className={styles.postCard}
//           />
//         ))}
//       </div>
//     </>
//   );
// }


"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/navbar";
import Searchbar from "../../components/searchbar";
import Postcard from "../../components/post_card";
import styles from "../../styles/searchpage.module.css";

export default function Search() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [searchText, setSearchText] = useState(initialQuery);
  const [posts, setPosts] = useState([
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortunately AI-generated.",
      creatorName: "Swagalicious995",
    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals...",
      creatorName: "ChatGPT 4o",
    },
    {
      postName: "Insightify",
      postInfo: "Insightify is a data visualization tool built for small business owners and analysts...",
      creatorName: "ChatGPT 4o",
    },
    {
      postName: "PathFinder",
      postInfo: "PathFinder is a career planning and mentorship platform designed to connect students...",
      creatorName: "ChatGPT 4o",
    },
  ]);

  const fetchProjects = async () => {
    console.log("Fetching projects...");
    try {
      const response = await fetch("http://localhost:5001/findProjects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery: searchText,
          tags: "",
          filter: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(data);

        if(data.length > 0){
          // Transform data to match the post structure
          const transformedPosts = data.map((item) => ({
            postName: item.title || "Untitled", // Default to "Untitled" if title is missing
            postInfo: item.description || "No description available", // Default description
            creatorName: item.creatorusername || "Anonymous", // Default creator name
          }));

          console.log(data[0].creatorusername);

          setPosts(transformedPosts); // Update the state with transformed data
        }
        else{
          setPosts([]);
        }
      } else {
        console.log("No projects found or an error occurred.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed, fetching projects...");
      fetchProjects();
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchText(query);
  };

  return (
    <>
      <Navbar />
      <Searchbar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown} // Pass the onKeyDown event
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
