'use client';
import '../styles/searchbar.modules.css';
import { useRouter } from "next/navigation";

export default function Searchbar({ onSearchChange }) {
  const router = useRouter();

  const handleSearchChange = (event) => {
    const query = event.target.value.trim();
    if (onSearchChange) {
      onSearchChange(query); // Update search text in page component
    }
  }
  const searchEnterPress = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value.trim();
      if (query) {
        //window.location.href = '/search?query=${encodeURIComponent(query)';
        router.push("/search");
      }
    }
  }
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
