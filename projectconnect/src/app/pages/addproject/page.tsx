"use client";
import Navbar from '../../components/navbar';
import "../../styles/newproject.css";

export default function Createpost() {
  return (
    <>
      <Navbar />
   
      <h1 className="formHeader">Create Project</h1>
      <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Select Tag
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" href="#">Arts/Crafts</a></li>
            <li><a className="dropdown-item" href="#">Business</a></li>
            <li><a className="dropdown-item" href="#">Coding</a></li>
            <li><a className="dropdown-item" href="#">Engineering</a></li>
            <li><a className="dropdown-item" href="#">Math</a></li>
            <li><a className="dropdown-item" href="#">Music</a></li>
            <li><a className="dropdown-item" href="#">Science</a></li>
            <li><a className="dropdown-item" href="#">Writing</a></li>
            <li><a className="dropdown-item" href="#">Other</a></li>
          </ul>
        </div>


        <div className="dropdown show">
  <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown link
  </a>

  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <a className="dropdown-item" href="#">Action</a>
    <a className="dropdown-item" href="#">Another action</a>
    <a className="dropdown-item" href="#">Something else here</a>
  </div>
</div>

      <div className="formContainer">
        
        <div className='formHeader'>
          <h3> Everyone</h3>
        </div>

        <form className="formInput">
          <input type="text" id="title" placeholder="Title*" className="inputBox" required />
          <textarea id="description" placeholder="Description*" className="inputBox" required></textarea>
          <input type="text" id="links" placeholder="Links" className="inputBox" />
          <input type="text" id="contact" placeholder="Contact Information" className="inputBox" />
        </form>

        <div className='formHeader'>
            <h3> Members</h3>
        </div>

        <form className='formInput'>
          <textarea id="more-description" placeholder="More Description*" className="inputBox" required></textarea>
          <textarea id="more-links" placeholder="More Links" className="inputBox" />
          <textarea id="more-contact" placeholder="More Contact Information" className="inputBox" />
        </form>

        <button type="submit" className="submit-button">Post</button>
      </div>
    </>
  );
}

