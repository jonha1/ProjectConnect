'use client';
import '../styles/searchbar.modules.css';
import { useRouter } from "next/navigation";

export default function Searchbar({ onSearchChange, routeToSearchPage }) {
  const router = useRouter();

  const handleSearchChange = (event) => {
    const query = event.target.value.trim();
    if (routeToSearchPage) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    } else if (onSearchChange) {
      onSearchChange(query); // Only update search state if not routing
    }
  };
  const searchEnterPress = (event) => {

    if (event.key === 'Enter') {
      const query = (event.target as HTMLInputElement).value.trim();
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
          onChange={handleSearchChange} // Trigger search on each keystroke
          onKeyPress={searchEnterPress}
        />
        <button type="button" className="btn searchButtons">Filter</button>
        <button type="button" className="btn searchButtons">Tags</button>
      </div>

    </div>
  );
}
