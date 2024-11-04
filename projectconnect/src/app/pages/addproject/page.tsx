"use client";
import Navbar from '../../components/navbar';
import "../../styles/newproject.css";
import React, {useState} from 'react';

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
  const handleClick = () => {
    setIsActive(true);
    // Optionally, reset the active state after a delay
    setTimeout(() => setIsActive(false), 2000); // Example: reset after 2 seconds
  };
  return (
    <>
      <Navbar />

      <h1 className="formHeader">Create Project</h1>
      <div className="dropdown">
        <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Project Tags
        </a>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a className="dropdown-item" href="#">Arts/Crafts</a>
          <a className="dropdown-item" href="#">Business</a>
          <a className="dropdown-item" href="#">Coding</a>
          <a className="dropdown-item" href="#">Engineering</a>
          <a className="dropdown-item" href="#">Math</a>
          <a className="dropdown-item" href="#">Music</a>
          <a className="dropdown-item" href="#">Science</a>
          <a className="dropdown-item" href="#">Writing</a>
          <a className="dropdown-item" href="#">Other</a>
        </div>
      </div>

      <div className="formContainer">
        <div className='formHeader'>
          <h3>Public Users</h3>
        </div>

        <form className="formInput">
          <input type="text" id="title" placeholder="Title*" className="inputBox" required />
          <AutoResizeTextarea placeholder="Project Description"/>
          <AutoResizeTextarea placeholder="Links" />
          <AutoResizeTextarea placeholder="Contact Information"  />
        </form>

        <div className='formHeader'>
          <h3> Members</h3>
        </div>

        <form className='formInput'>
          <AutoResizeTextarea  placeholder="Member Description" />
          <AutoResizeTextarea  placeholder="Member Links" />
          <AutoResizeTextarea  placeholder="Member Contact Information" />
        </form>

        <button 
          type="submit" 
          className={`submit-button ${isActive ? 'active' : ''}`} 
          onClick={handleClick}
        >Post</button>
      </div>
      <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </>
  );
}


