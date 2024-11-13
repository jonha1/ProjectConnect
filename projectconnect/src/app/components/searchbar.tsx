'use client';
import React from 'react';
import '../styles/searchbar.modules.css';
import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useState, useEffect } from 'react';


interface SearchbarProps {
  onSearchChange?: (query: string) => void;
  searchText?: string;
  routeToSearchPage?: boolean;
}

export default function Searchbar({ onSearchChange, searchText = "", routeToSearchPage }: SearchbarProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchText);

  useEffect(() => {
    // Update inputValue if searchText prop changes
    setInputValue(searchText);
  }, [searchText]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query); // Update local state with current input
    if (!routeToSearchPage && onSearchChange) {
      onSearchChange(query);
    }
  };

  const searchEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = inputValue.trim();
      if (query) {
        router.push(`/search?query=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div className="parentContainer">
      <div className="searchContainer">
        <input
          id="search"
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleSearchChange}
          onKeyDown={searchEnterPress}
        />
        <button type="button" className="btn searchButtons">Filter</button>
        <button type="button" className="btn searchButtons">Tags</button>
      </div>
    </div>
  );
}
