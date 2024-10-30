import '../styles/searchbar.modules.css'
export default function Searchbar() {
  return (
    <div className="parentContainer">
        <div className="searchContainer">
            <input id="search" type="text" placeholder="Search..."></input>
            <button type="button" className="btn searchButtons">Filter</button>
            <button type="button" className="btn searchButtons">Tags</button>
        </div>
    </div>
  );
}
