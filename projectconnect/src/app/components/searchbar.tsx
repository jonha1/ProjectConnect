'use client';
import '../styles/searchbar.modules.css'
import { useRouter } from "next/navigation";
export default function Searchbar() {
  const router = useRouter();
  const searchEnterPress = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value.trim();
      if (query) {
        //window.location.href = '/search?query=${encodeURIComponent(query)';
        router.push("/search");
      }
    }
  };

  return (
    <div className="parentContainer">
        <div className="searchContainer">
            <input 
              id="search" 
              type="text" 
              placeholder="Search.."
              onKeyPress={searchEnterPress}
              />
            <button type="button" className="btn searchButtons">Filter</button>
            <button type="button" className="btn searchButtons">Tags</button>
        </div>
    </div>
  );
}


