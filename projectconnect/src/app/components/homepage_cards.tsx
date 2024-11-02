import '../styles/homepage_cards.modules.css';

interface Props {
  tags: string[];
}

export default function HomepageCards({ tags }: Props) {
  return (
    <div className="tagContainer">
      {tags.map((tag, index) => (
        <div key={index} className="tagItem"> {/* key is moved here */}
          <h1 className="tagText">{tag}</h1>
        </div>
      ))}
    </div>
  );
}
