import '../styles/post_card.module.css';

export default function PostCard({ postName, postInfo, creatorName }) {
  return (
    <div className="cardContainer">
      <h2 className="postName">{postName}</h2>
      <p className="postInfo">{postInfo}</p>
      <p className="creatorName">Created by: {creatorName}</p>
    </div>
  );
}