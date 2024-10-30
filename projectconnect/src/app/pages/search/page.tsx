import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Postcard from '../../components/post_card';
import styles from '../../styles/searchpage.module.css';  // Import the CSS file for styling

export default function Search() {
  const posts = [
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long.",
      creatorName: "Swagalicious995"
    },
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long.",
      creatorName: "Swagalicious995"
    },
    {
      postName: "ProjectConnect",
      postInfo: "Here would be the descriptions of project that shouldn't be too long.",
      creatorName: "Swagalicious995"
    },
  ];

  return (
    <>
      <Navbar />
      <Searchbar />
      <div className={styles.postContainer}>
        {posts.map((post, index) => (
          <Postcard
            key={index}
            postName={post.postName}
            postInfo={post.postInfo}
            creatorName={post.creatorName}
            className={styles.postCard}  // Apply class to each card
          />
        ))}
      </div>
    </>
  );
}
