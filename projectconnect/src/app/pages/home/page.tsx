"use client";
import { supabase } from "../../lib/supabase";

import Navbar from "../../components/navbar";
import Searchbar from "../../components/searchbar";
import HomepageCards from "../../components/homepage_cards";

export default function Home() {
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

  return (
    <>
      <Navbar />
      <Searchbar />
      <HomepageCards tags={tags} />
    </>
  );
}
