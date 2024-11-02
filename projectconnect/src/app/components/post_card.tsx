"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import styles from '../styles/post_card.module.css';

export default function PostCard({ postName, postInfo, creatorName }) {
  const router = useRouter();
  const handleClickPost = () => {
    router.push("/");
  }

  return (
    <div className={styles.cardContainer} onClick = {handleClickPost}>
      <div className={styles.header}>
        <h2 className={styles.postName}>{postName}</h2>
        <a className={styles.iconLink}>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </div>
      <p className={styles.postInfo}>{postInfo}</p>
      <p className={styles.creatorName}>Created by: {creatorName}</p>
    </div>
  );
}
