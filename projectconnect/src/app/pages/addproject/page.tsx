"use client";
import Navbar from '../../components/navbar';
import "../../styles/newproject.css";

export default function Createpost() {
  return (
    <>
      <Navbar />

      <h1 className="formHeader">Create Project</h1>


      <div className="dropdown show">
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
      <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </>
  );
}

