"use client";
import { useState } from 'react';
import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Postcard from '../../components/post_card';
import styles from '../../styles/searchpage.module.css';

export default function Search() {
  const [searchText, setSearchText] = useState("");

  const posts = [
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
    {
      postName: "Insightify",
      postInfo: "Insightify is a data visualization tool built for small business owners and analysts who need intuitive, real-time insights into their operations. This project processes data from various sources, such as sales, customer feedback, and inventory, and visualizes key trends using dynamic graphs and charts. With a sleek React UI, Express for API handling, and D3.js for interactive charts, Insightify offers actionable insights at a glance, simplifying decision-making for business growth.",
      creatorName: "ChatGPT 4o"
    },
    {
      postName: "PathFinder",
      postInfo: "PathFinder is a career planning and mentorship platform designed to connect students and recent graduates with mentors in their desired fields. Users can create profiles, browse career paths, access mentorship resources, and engage in direct messaging with mentors. The project combines React for user interfaces, Node.js for backend services, and PostgreSQL to store user profiles and career data. PathFinder aims to make career guidance accessible and tailored to individual aspirations.",
      creatorName: "ChatGPT 4o"
    }
  ];

  const filteredPosts = posts.filter(post =>
    post.postName.toLowerCase().includes(searchText.toLowerCase()) ||
    post.postInfo.toLowerCase().includes(searchText.toLowerCase()) ||
    post.creatorName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (query) => {
    setSearchText(query);
  };

  return (
    <>
      <Navbar />
      <Searchbar onSearchChange={handleSearchChange} />
      <div className={styles.postContainer}>
        {filteredPosts.map((post, index) => (
          <Postcard
            key={index}
            postName={post.postName}
            postInfo={post.postInfo}
            creatorName={post.creatorName}
            className={styles.postCard}
          />
        ))}
      </div>
    </>
  );
}
