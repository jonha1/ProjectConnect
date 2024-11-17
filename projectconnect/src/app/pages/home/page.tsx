"use client";
import React from 'react';
import Navbar from "../../components/navbar";
import Searchbar from "../../components/searchbar";
import HomepageCards from "../../components/homepage_cards";
import { useRouter } from "next/navigation";
import { useSearchContext } from "../../context/SearchContext";

export default function Home() {
  const { searchText, setSearchText } = useSearchContext();
  const router = useRouter();

  const tags = [
    "Arts/Crafts",
    "Business",
    "Coding",
    "Engineering",
    "Math",
    "Music",
    "Science",
    "Writing",
    "Other",
  ];

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (searchText.trim()) {
        router.push("/search");
      }
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
        onKeyDown={handleSearchKeyDown}
      />
      <HomepageCards tags={tags} />
    </>
  );
}
