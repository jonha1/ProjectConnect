"use client";
import '../styles/homepage_cards.modules.css';
import { useRouter } from "next/navigation";

interface Props {
    tags: string[]; // Update the prop to accept an array of tags
}

export default function HomepageCards({ tags }: Props) {
  const router = useRouter();

  const handleClickEvent = () => {
      router.push("/search");
  };

  return (
    <div className="tagContainer">
      {tags.map((tag, index) => (
        <div key={index} className="tagItem" onClick={handleClickEvent}>
            {tag}
        </div>
      ))}
    </div>
  );
}
