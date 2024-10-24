import '../styles/homepage_cards.modules.css';

interface Props {
    tags: string[]; // Update the prop to accept an array of tags
}

export default function HomepageCards({ tags }: Props) {
  return (
    <div className="tagContainer">
      {tags.map((tag, index) => (
        <div className="tagItem">
            <h1 key={index} className="tagText">
              {/* <span className="text">{tag}</span> */}
              {tag}
            </h1>
        </div>
      ))}
    </div>
  );
}
