"use client";
import { useState } from "react";
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Searchbar from "../../components/searchbar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("created"); // Tracks active tab

  return (
    <div className="wrapper">
      <Navbar />

      <div className="contentContainer">
        <div className="sidePanel">
          <div className="displayName">William Li</div>
          <div className="userName">SuaveSailor</div>
          <div className="profileCard">
            About Me: A little about me... I love mangos they make me feel so
            nice and yummy, mapo tofu is so silky and spicy, and baja blast to
            wash it all down. In my free time, I love to make silly faces in the
            mirror and tell myself that everything is going to be okay. I have
            nothing else to say, so for now I leave you with this "CHICK BUTT
            CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT
            CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT
            CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT
            CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT
            CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT CHICK BUTT
            CHICK BUTT "
          </div>
          <div className="profileCard">
            <p>Contact Information: </p>
            <p>Email: temporaryEmail@gmail.com</p>
            <p>LinkedIn: linkedin/temp</p>
          </div>
          <div className="profileCard">Skills: C++, C, Python, Java, React</div>
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
          <div className={`tabs`}>
            <div
              className={activeTab === "created" ? "activeTab" : ""}
              onClick={() => setActiveTab("created")}
            >
              Created Projects
            </div>
            <div
              className={activeTab === "joined" ? "activeTab" : ""}
              onClick={() => setActiveTab("joined")}
            >
              Joined Projects
            </div>
            <div
              className={activeTab === "bookmarks" ? "activeTab" : ""}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </div>
          </div>

          <Searchbar />

          <div className="projects">
            {activeTab === "created" && (
              <div className="createdProjects">
                {/* Content for Created Projects */}
                <p>Here are your created projects.</p>
              </div>
            )}
            {activeTab === "joined" && (
              <div className="joinedProjects">
                {/* Content for Joined Projects */}
                <p>Here are the projects you've joined.</p>
              </div>
            )}
            {activeTab === "bookmarks" && (
              <div className="bookmarks">
                {/* Content for Bookmarks */}
                <p>Here are your bookmarked projects.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
