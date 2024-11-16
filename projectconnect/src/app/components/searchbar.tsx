'use client';
import '../styles/searchbar.modules.css';
import { ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchbarProps {
  onSearchChange?: (query: string) => void;
  searchText?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export default function Searchbar({ onSearchChange, searchText = "", onKeyDown }: SearchbarProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchText);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  useEffect(() => {
    // Update inputValue if searchText prop changes
    setInputValue(searchText);
  }, [searchText]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (onSearchChange) {
      onSearchChange(query);  // Update the parent with the search query
    }
  };

  return (
    <div className="parentContainer">
      <div className="searchContainer">
        <input
          id="search"
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={onKeyDown} // Pass the onKeyDown prop directly to the input field
        />
         {/* Filter Button */}
         <button type="button" className="btn searchButtons" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          Filter
        </button>
        {isFilterOpen && (
          <div className="dropdown filterDropdown">
            <div className="dropdown-item">Time Posted</div>
            <div className="dropdown-item">Number of Members</div>
            <div className="dropdown-item">Title</div>
            <div className="dropdown-item">Description</div>
          </div>
        )}

        {/* Tags Button */}
        <button type="button" className="btn searchButtons" onClick={() => setIsTagsOpen(!isTagsOpen)}>
          Tags
        </button>
        {isTagsOpen && (
          <div className="dropdown tagsDropdown">
            <div className="dropdown-item">Arts</div>
            <div className="dropdown-item">Business</div>
            <div className="dropdown-item">Coding</div>
            <div className="dropdown-item">Engineering</div>
            <div className="dropdown-item">Math</div>
            <div className="dropdown-item">Music</div>
            <div className="dropdown-item">Science</div>
            <div className="dropdown-item">Writing</div>
            <div className="dropdown-item">Other</div>
          </div>
        )}
      </div>
    </div>
  );
}
