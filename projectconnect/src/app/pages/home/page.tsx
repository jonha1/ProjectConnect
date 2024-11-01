import { supabase } from "../../lib/supabase";

import Navbar from "../../components/navbar";
import Searchbar from "../../components/searchbar";
import HomepageCards from "../../components/homepage_cards";

export default function Home() {
  const setNewView = async () => {
    const { data, error } = await supabase
    .from("views")
    .insert({
      name: 'random name'
    })

    if(data) console.log(data)
    if(error) console.log(error)
  };

  setNewView();

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
