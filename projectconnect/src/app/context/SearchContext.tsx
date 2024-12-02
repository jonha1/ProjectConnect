// "use client";

// import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// // Define the shape of the context data
// interface SearchContextType {
//   searchText: string;
//   setSearchText: (query: string) => void;
//   tag: string;
//   setTag: (tag: string) => void;
// }

// // Create the context
// const SearchContext = createContext<SearchContextType | undefined>(undefined);

// // Create a provider component
// export const SearchProvider = ({ children }: { children: ReactNode }) => {
//   const [searchText, setSearchText] = useState<string>("");
//   const [tag, setTag] = useState<string>("");
//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   if (!isHydrated) {
//     return null; // Render nothing until hydration is complete
//   }

//   return (
//     <SearchContext.Provider value={{ searchText, setSearchText, tag, setTag }}>
//       {children}
//     </SearchContext.Provider>
//   );
// };

// // Create a custom hook for consuming the context
// export const useSearchContext = () => {
//   const context = useContext(SearchContext);
//   if (!context) {
//     throw new Error("useSearchContext must be used within a SearchProvider");
//   }
//   return context;
// };

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  const [searchText, setSearchText] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("searchText") || "" : ""
  );
  const [tag, setTag] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("tag") || "" : ""
  );

  useEffect(() => {
    localStorage.setItem("searchText", searchText);
  }, [searchText]);

  useEffect(() => {
    localStorage.setItem("tag", tag);
  }, [tag]);

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
