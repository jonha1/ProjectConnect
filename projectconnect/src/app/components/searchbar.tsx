'use client';
import '../styles/searchbar.modules.css'
export default function Searchbar() {
  const searchEnterPress = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value.trim();
      console.log(query);
      if (query) {
        window.location.href = '/search' //?query=${encodeURIComponent(query)';
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


