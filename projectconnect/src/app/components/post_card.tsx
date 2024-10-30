import styles from '../styles/post_card.module.css';

export default function PostCard({ postName, postInfo, creatorName }) {
  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.postName}>{postName}</h2>
      <p className={styles.postInfo}>{postInfo}</p>
      <p className={styles.creatorName}>Created by: {creatorName}</p>
    </div>
  );
}
