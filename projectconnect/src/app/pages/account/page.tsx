import Navbar from '../../components/navbar';
import "../../styles/account.page.css";
import Searchbar from '../../components/searchbar';

export default function Home() {
  return (
    <div className="wrapper">
      <Navbar />

      <div className="contentContainer">

        <div className="sidePanel">
          <div className="displayName">
            William Li BLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
          </div>
          <div className="userName">
            SuaveSailor
          </div>
          <div className="profileCard">
            About Me: This is temporary about me BLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
          </div>
          <div className="profileCard">
            <p>Contact Information: </p>
            <p>Email: temporaryEmail@gmail.com</p>
            <p>LinkedIn: linkedin/temp</p>
          </div>
          <div className="profileCard">
            Skills: C++, C, Python, Java, React
          </div>
          <div className="buttonContainer">
            <button type="button" className="btn profileActionButtons">
              Edit Profile
            </button>
            <button type="button" className="btn profileActionButtons">
              Settings
            </button>
          </div>
        </div>

        <div className="mainContent">
          <div className="tabs">
              <div>
                Created Projects
              </div>
              <div>
                Joined Projects
              </div>
              <div>
                Bookmarks
              </div>
          </div>
          <Searchbar />
          <div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
