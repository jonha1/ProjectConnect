import Navbar from '../components/navbar';
import "../styles/newpost.modules.css";

export default function Createpost() {
  return (
    <>
      <Navbar />
      <h1 className="formHeader">Create Project</h1>

      <div className="formContainer">

        <div className="formDropdown">
          <select name="Tags" id="Tags" className="formDropdown">
            <option value="Arts/Crafts">Arts/Crafts</option>
            <option value="Business">Business</option>
            <option value="Coding">Coding</option>
            <option value="Engineering">Engineering</option>
            <option value="Math">Math</option>
            <option value="Music">Music</option>
            <option value="Science">Science</option>
            <option value="Writing">Writing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <form className="formInput">
          <input type="text" id="title" placeholder="Title" className="inputBox" required />
          <input type="text" id="description" placeholder="Description" className="inputBox" />
          <input type="text" id="links" placeholder="Links" className="inputBox" />
          <input type="text" id="contact" placeholder="Contact Information" className="inputBox" />
        </form>

        <button type="submit" className="submit-button">Post</button>

      </div>
    </>
  );
}
