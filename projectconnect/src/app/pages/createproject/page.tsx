"use client";
import Navbar from '../../components/navbar';
import "../../styles/createproject.page.css";
import React, {useState} from 'react';
import { useRouter } from "next/navigation";

type AutoResizeTextareaProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function AutoResizeTextarea({ placeholder, value, onChange }: AutoResizeTextareaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';  // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`;  // Adjust to content height
    onChange(textarea.value);
  };

  return (
    <textarea
      value={value}
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
  const router = useRouter();

  const[projectData,setProjectData]= useState({
    title:'',
    description:'',
    links:'',
    contact:'',
    memberDescription:'',
    memberLinks:'',
    memberContact:''
    })

    const handleInputChange = (field: string, value: string) => {
      // console.log(`Field updated: ${field}, New Value: ${value}`);
      setProjectData({ ...projectData, [field]: value });
    };

    const handleSubmit = () => {
      const payload = {
        title: projectData.title,
        description: projectData.description,
        links: projectData.links,
        contact: projectData.contact,
        members: {
          description: projectData.memberDescription,
          links: projectData.memberLinks,
          contact: projectData.memberContact
        }
      };
      
      console.log("string to pass to api", payload);
      router.push("/");
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
          <h3>Everyone</h3>
        </div>

        <form className="formInput">
          <AutoResizeTextarea 
            placeholder="Title*" 
            value={projectData.title} 
            onChange={(value) => handleInputChange('title', value)} 
          />
          <AutoResizeTextarea 
            placeholder="Project Description*" 
            value={projectData.description} 
            onChange={(value) => handleInputChange('description', value)} 
          />
          <AutoResizeTextarea 
            placeholder="Links" 
            value={projectData.links} 
            onChange={(value) => handleInputChange('links', value)} 
          />
          <AutoResizeTextarea 
            placeholder="Contact Information" 
            value={projectData.contact  } 
            onChange={(value) => handleInputChange('contact', value)} 
          />
        </form>
        <div className='formHeader'>
          <h3> Members</h3>
        </div>

        <form className='formInput'>
        <AutoResizeTextarea  
            placeholder="Member Description" 
            value={projectData.memberDescription} 
            onChange={(value) => handleInputChange('memberDescription', value)} 
          />
          <AutoResizeTextarea  
            placeholder="Member Links" 
            value={projectData.memberLinks} 
            onChange={(value) => handleInputChange('memberLinks', value)} 
          />
          <AutoResizeTextarea  
            placeholder="Member Contact Information" 
            value={projectData.memberContact} 
            onChange={(value) => handleInputChange('memberContact', value)} 
          />
        </form>

        <button 
          type="submit" 
          className="submit-button" 
          onClick={handleSubmit}
        >
            Post
        </button>
      </div>
      <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>
    </>
  );
}