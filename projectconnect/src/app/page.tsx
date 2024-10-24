import Navbar from './components/navbar';
import Searchbar from './components/searchbar';
import HomepageCards from './components/homepage_cards';
import "./styles/app.page.css";

export default function Home() {
  const tags = ["Arts/Crafts", "Business", "Coding", "Engineering", "Math", "Music", "Science", "Writing", "Other"];

  return (
    <>
      <Navbar />
      <div className="searchBarContainer">
        <Searchbar />
      </div>
      <HomepageCards tags={tags} />
    </>
  );
}
