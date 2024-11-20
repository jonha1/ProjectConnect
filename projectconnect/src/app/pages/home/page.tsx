"use client";
import React, {useEffect} from "react";
import Navbar from "../../components/navbar";
import Searchbar from "../../components/searchbar";
import HomepageCards from "../../components/homepage_cards";
import { useRouter } from "next/navigation";
import { useSearchContext } from "../../context/SearchContext";
import Cookies from "js-cookie"; // Import js-cookie for cookie management
import '../../styles/home.page.css';
import Cookies from "js-cookie";

export default function Home() {
  const { searchText, setSearchText, setTag } = useSearchContext();
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

  useEffect(() => {
    const username = Cookies.get("username");
    console.log(username);
    if (!username) {
      router.push("/login"); 
    }
  }, [router]); 

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

  const handleTagClick = (tag: string) => {
    setTag(tag); // Update the tag in the context
    router.push("/search");
  };

  return (
    <>
      <Navbar />
      <Searchbar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      />
      <div id="prompt">
        <h2>
          Don&#39;t know what to search for? View projects by category tags below!
        </h2>
      </div>
      <HomepageCards tags={tags} onTagClick={handleTagClick} />
    </>
  );
}
