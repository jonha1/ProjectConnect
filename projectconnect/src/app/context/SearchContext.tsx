"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context data
interface SearchContextType {
  searchText: string;
  setSearchText: (query: string) => void;
  tag: string;
  setTag: (tag: string) => void;
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a provider component
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchText, setSearchText, tag, setTag }}>
      {children}
    </SearchContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

