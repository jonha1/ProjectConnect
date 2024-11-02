"use client";
import { useState } from "react";
import Navbar from "../../components/navbar";
import "../../styles/account.page.css";
import Searchbar from "../../components/searchbar";
import Postcard from '../../components/post_card';
import styles from '../../styles/searchpage.module.css';  // Import the CSS file for styling


export default function Home() {
  const [activeTab, setActiveTab] = useState("created"); // Tracks active tab

  const postsCreated = [
    {
      postName: "ProjectConnect_Created",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995"

    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "Insightify",
      postInfo: "Insightify is a data visualization tool built for small business owners and analysts who need intuitive, real-time insights into their operations. This project processes data from various sources, such as sales, customer feedback, and inventory, and visualizes key trends using dynamic graphs and charts. With a sleek React UI, Express for API handling, and D3.js for interactive charts, Insightify offers actionable insights at a glance, simplifying decision-making for business growth.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "PathFinder",
      postInfo: "PathFinder is a career planning and mentorship platform designed to connect students and recent graduates with mentors in their desired fields. Users can create profiles, browse career paths, access mentorship resources, and engage in direct messaging with mentors. The project combines React for user interfaces, Node.js for backend services, and PostgreSQL to store user profiles and career data. PathFinder aims to make career guidance accessible and tailored to individual aspirations.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995"

    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o"
    },
  ];

  const postsJoined = [
    {
      postName: "ProjectConnect_Joined",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995"

    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "Insightify",
      postInfo: "Insightify is a data visualization tool built for small business owners and analysts who need intuitive, real-time insights into their operations. This project processes data from various sources, such as sales, customer feedback, and inventory, and visualizes key trends using dynamic graphs and charts. With a sleek React UI, Express for API handling, and D3.js for interactive charts, Insightify offers actionable insights at a glance, simplifying decision-making for business growth.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "PathFinder",
      postInfo: "PathFinder is a career planning and mentorship platform designed to connect students and recent graduates with mentors in their desired fields. Users can create profiles, browse career paths, access mentorship resources, and engage in direct messaging with mentors. The project combines React for user interfaces, Node.js for backend services, and PostgreSQL to store user profiles and career data. PathFinder aims to make career guidance accessible and tailored to individual aspirations.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995"

    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o"
    },
  ];

  const postsBookmarked = [
    {
      postName: "ProjectConnect_Bookmarked",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995"

    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "Insightify",
      postInfo: "Insightify is a data visualization tool built for small business owners and analysts who need intuitive, real-time insights into their operations. This project processes data from various sources, such as sales, customer feedback, and inventory, and visualizes key trends using dynamic graphs and charts. With a sleek React UI, Express for API handling, and D3.js for interactive charts, Insightify offers actionable insights at a glance, simplifying decision-making for business growth.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "PathFinder",
      postInfo: "PathFinder is a career planning and mentorship platform designed to connect students and recent graduates with mentors in their desired fields. Users can create profiles, browse career paths, access mentorship resources, and engage in direct messaging with mentors. The project combines React for user interfaces, Node.js for backend services, and PostgreSQL to store user profiles and career data. PathFinder aims to make career guidance accessible and tailored to individual aspirations.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long. The next few are unfortuantely ai generated.",
      creatorName: "Swagalicious995"

    },
    {
      postName: "Nexxus Connect",
      postInfo: "Nexxus Connect is a networking platform designed to foster collaboration among freelance professionals. With features like a personalized portfolio builder, advanced project matching, and secure messaging, users can seamlessly connect with potential clients and other freelancers in their field. Built with a React frontend, Node.js backend, and PostgreSQL for data management, Nexxus Connect helps bridge the gap between opportunity and skill, creating an ecosystem that thrives on collaboration.",
      creatorName: "ChatGPT 4o"
    },
  ];

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
                <div className={styles.postContainer}>
                  {postsCreated.map((post, index) => (
                    <Postcard
                      key={index}
                      postName={post.postName}
                      postInfo={post.postInfo}
                      creatorName={post.creatorName}
                      className={styles.postCard}  // Apply class to each card
                    />
                  ))}
                </div>
              </div>
            )}
            {activeTab === "joined" && (
              <div className="joinedProjects">
                <div className={styles.postContainer}>
                  {postsJoined.map((post, index) => (
                    <Postcard
                      key={index}
                      postName={post.postName}
                      postInfo={post.postInfo}
                      creatorName={post.creatorName}
                      className={styles.postCard}  // Apply class to each card
                    />
                  ))}
                </div>
              </div>
            )}
            {activeTab === "bookmarks" && (
              <div className="bookmarks">
                <div className={styles.postContainer}>
                  {postsBookmarked.map((post, index) => (
                    <Postcard
                      key={index}
                      postName={post.postName}
                      postInfo={post.postInfo}
                      creatorName={post.creatorName}
                      className={styles.postCard}  // Apply class to each card
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
