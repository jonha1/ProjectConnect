// "use client";
// import React from 'react';
// import '../styles/searchbar.modules.css';
// import { ChangeEvent, KeyboardEvent } from 'react';
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useSearchContext } from "../context/SearchContext";

// interface SearchbarProps {
//   onSearchChange?: (query: string) => void;
//   searchText?: string;
//   onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
// }

// export default function Searchbar({ onSearchChange, searchText = "", onKeyDown }: SearchbarProps) {
//   const router = useRouter();
//   const { tag, setTag } = useSearchContext(); // Access `tag` and `setTag` from SearchContext
//   const [inputValue, setInputValue] = useState(searchText);

//   useEffect(() => {
//     // Update inputValue if searchText prop changes
//     setInputValue(searchText);
//   }, [searchText]);

//   const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value;
//     if (onSearchChange) {
//       onSearchChange(query); // Update the parent with the search query
//     }
//   };

//   const handleTagSelect = (tag: string) => {
//     setTag(tag); // Update the tag in SearchContext
//   };

//   const handleClearTag = () => {
//     setTag(""); // Reset the tag in SearchContext
//   };

//   const handleAllProjects = () => {
//     setTag("");
//     setInputValue("");
//     router.push("/search");
//   }

//   return (
//     <div className="parentContainer">
//       <div className="searchContainer">
//         <input
//           id="search"
//           type="text"
//           placeholder="Search..."
//           value={searchText}
//           onChange={handleSearchChange}
//           onKeyDown={onKeyDown} // Pass the onKeyDown prop directly to the input field
//         />

//         <div className="dropdown">
//           <button
//             className="btn btn-secondary dropdown-toggle"
//             type="button"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             {tag || "Tags"}
//           </button>
//           <ul className="dropdown-menu">
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Arts/Crafts")}>Arts/Crafts</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Business")}>Business</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Coding")}>Coding</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Engineering")}>Engineering</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Math")}>Math</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Music")}>Music</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Science")}>Science</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Writing")}>Writing</a></li>
//             <li><a className="dropdown-item" onClick={() => handleTagSelect("Other")}>Other</a></li>
//             <li><a className="dropdown-item text-danger" onClick={handleClearTag}>Clear</a></li> {/* Clear option */}
//           </ul>
//         </div>

//         <button type="button" className="btn searchButtons" onClick={handleAllProjects}>All projects</button>
//       </div>
//     </div>
//   );
// }

"use client";
import React from 'react';
import '../styles/searchbar.modules.css';
import { ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchContext } from "../context/SearchContext";

interface SearchbarProps {
  onSearchChange?: (query: string) => void;
  searchText?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export default function Searchbar({ onSearchChange, searchText = "", onKeyDown }: SearchbarProps) {
  const router = useRouter();
  const { tag, setTag } = useSearchContext(); // Access `tag` and `setTag` from SearchContext
  const [inputValue, setInputValue] = useState(searchText);

  useEffect(() => {
    // Update inputValue if searchText prop changes
    setInputValue(searchText);
  }, [searchText]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query); // Update local state
    if (onSearchChange) {
      onSearchChange(query); // Update the parent with the search query
    }
  };

  const handleTagSelect = (tag: string) => {
    setTag(tag); // Update the tag in SearchContext
  };

  const handleClearTag = () => {
    setTag(""); // Reset the tag in SearchContext
  };

  const handleAllProjects = () => {
    setTag("");
    setInputValue(""); // Reset the input field value
    if (onSearchChange) {
      onSearchChange(""); // Force a re-fetch with an empty query
    }
    router.push("/search");
  };

  return (
    <div className="parentContainer">
      <div className="searchContainer">
        <input
          id="search"
          type="text"
          placeholder="Search..."
          value={inputValue} // Use local inputValue state
          onChange={handleSearchChange} // Update local state and propagate changes
          onKeyDown={onKeyDown} // Pass the onKeyDown prop directly to the input field
        />

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {tag || "Tags"}
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Arts/Crafts")}>Arts/Crafts</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Business")}>Business</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Coding")}>Coding</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Engineering")}>Engineering</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Math")}>Math</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Music")}>Music</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Science")}>Science</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Writing")}>Writing</a></li>
            <li><a className="dropdown-item" onClick={() => handleTagSelect("Other")}>Other</a></li>
            <li><a className="dropdown-item text-danger" onClick={handleClearTag}>Clear</a></li> {/* Clear option */}
          </ul>
        </div>

        <button type="button" className="btn searchButtons" onClick={handleAllProjects}>All projects</button>
      </div>
    </div>
  );
}
