// "use client";
// import '../styles/homepage_cards.modules.css';
// import React from 'react';
// import { useRouter } from "next/navigation";

// interface Props {
//   tags: string[];
// }

// export default function HomepageCards({ tags }: Props) {
//   const router = useRouter();

//   const handleClickEvent = () => {
//       router.push("/search");
//   };

//   return (
//     <div className="tagContainer">
//       {tags.map((tag, index) => (
//         <div key={index} className="tagItem" onClick={handleClickEvent}>
//             {tag}
//         </div>
//       ))}
//     </div>
//   );
// }
"use client";
import '../styles/homepage_cards.modules.css';
import React from 'react';

interface Props {
  tags: string[];
  onTagClick: (tag: string) => void; // Callback for tag clicks
}

export default function HomepageCards({ tags, onTagClick }: Props) {
  return (
    <div className="tagContainer">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="tagItem"
          onClick={() => onTagClick(tag)} // Trigger the callback when clicked
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
