'use client';
import '../styles/searchbar.modules.css';
import { ChangeEvent, KeyboardEvent } from 'react';

interface SearchbarProps {
  onSearchChange?: (query: string) => void;
  searchText?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export default function Searchbar({ onSearchChange, searchText = "", onKeyDown }: SearchbarProps) {

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
        <button type="button" className="btn searchButtons">
          Filter
        </button>
        <button type="button" className="btn searchButtons">
          Tags
        </button>
      </div>
    </div>
  );
}

