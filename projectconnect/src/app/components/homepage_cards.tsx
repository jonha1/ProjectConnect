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
