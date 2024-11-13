"use client";
import Navbar from '../../components/navbar';
import "../../styles/accountInfo.page.css";
import React, {useState} from 'react';
import { useRouter } from "next/navigation";


function AutoResizeTextarea({ placeholder }: { placeholder: string }) {
  const [text, setText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';  // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`;  // Adjust to content height
    setText(textarea.value);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      placeholder={placeholder}
      className="inputBox"
      style={{
        width: '100%',
        minHeight: '50px',
        resize: 'none',
        overflow: 'hidden',
      }}
      required
    />
  );
}

export default function Createpost() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 2000); //2seconds 
    router.push("/");
  };
  return (
    <>
    <div className="formContainer">
        <div className='formHeader'>
            <h1> Tell people about yourself</h1>
        </div>

        <form className="formInput">
          <AutoResizeTextarea placeholder="Display Name"  />
          <AutoResizeTextarea placeholder="Contact Information"/>
          <AutoResizeTextarea placeholder="Skills" />
          <AutoResizeTextarea placeholder="About Me"  />
        </form>

        <div className="buttons">        
          <button 
          type="submit" 
          className="submit-button" 
          onClick={handleClick}
        >
            Skip
        </button>
        <button 
          type="submit" 
          className="submit-button" 
          onClick={handleClick}
        >
            Next
        </button>        
        </div>

      </div>
     
    </>
  );
}