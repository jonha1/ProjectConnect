// "use client";
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Navbar from '../../components/navbar';
// import Searchbar from '../../components/searchbar';
// import Postcard from '../../components/post_card';
// import styles from '../../styles/searchpage.module.css';

// interface Post {
//   postName: string;
//   postInfo: string;
//   creatorName: string;
// }

// export default function Search() {
//   const searchParams = useSearchParams();
//   const initialQuery = searchParams.get("query") || "";
//   const [searchText, setSearchText] = useState(initialQuery);
//   const [posts, setPosts] = useState<Post[]>([]);

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
//           searchQuery: searchText.trim(), // Send searchText or an empty string
//           tags: "",
//           filter: "",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (Array.isArray(data)) {
//         if (data.length > 0) {
//           const transformedPosts = data.map((item) => ({
//             postName: item.title || "Untitled",
//             postInfo: item.description || "No description available",
//             creatorName: item.creatorusername || "Anonymous",
//           }));
//           setPosts(transformedPosts);
//         } else {
//           setPosts([]);
//         }
//       } else {
//         console.log("No projects found or an error occurred.");
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };

//   const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       console.log("Enter key pressed, fetching projects...");
//       fetchProjects();
//     }
//   };

//   useEffect(() => {
//     // Call fetchProjects whenever searchText changes
//     fetchProjects();
//   }, [searchText]);

//   return (
//     <>
//       <Navbar />
//       <Searchbar
//         searchText={searchText}
//         onSearchChange={handleSearchChange}
//         onKeyDown={handleSearchKeyDown}
//       />
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
import { useState, useEffect } from 'react';
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

export default function Search() {
  const { searchText, setSearchText } = useSearchContext();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5001/findProjects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery: searchText.trim(),
          tags: "",
          filter: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data.map(item => ({
          postName: item.title || "Untitled",
          postInfo: item.description || "No description available",
          creatorName: item.creatorusername || "Anonymous",
        })));
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchText]);

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
