"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import styles from '../styles/post_card.module.css';
import React from 'react';

interface PostCardProps {
  postName: string;
  postInfo: string;
  creatorName: string;
  className?: string; // className is optional
}

export default function PostCard({ postName, postInfo, creatorName, className }: PostCardProps) {
  const router = useRouter();

  const handleClickPost = () => {
    const formattedPostName = encodeURIComponent(postName);
    const destination = "?creator=" + creatorName + "&title=" + formattedPostName;
    router.push(`/post${destination}`);
  };

  return (
    <div className={`${styles.cardContainer} ${className}`} onClick={handleClickPost}>
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
