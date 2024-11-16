"use client"; 

// In React, Context is a way to manage state or data globally, without having to manually pass props down through multiple layers of components. 
// It is useful when you need to share data (like user information, theme settings, or in your case, the searchText) across the entire component tree.

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context data (for TypeScript)
interface SearchContextType {
  searchText: string;
  setSearchText: (query: string) => void;
}

// Create the context with a default value of `undefined`
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// THIS WRAPS LAYOUT.TSX
// Create a provider component
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
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
