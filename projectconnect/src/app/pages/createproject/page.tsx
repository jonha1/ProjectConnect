"use client";
import Navbar from '../../components/navbar';
import "../../styles/createproject.page.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { getUsernameFromCookie } from "../../lib/cookieUtils";

type AutoResizeTextareaProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function AutoResizeTextarea({ placeholder, value, onChange }: AutoResizeTextareaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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

  const [projectData, setProjectData] = useState({
    creatorusername: '',
    tag: '',
    title: '',
    description: '',
    links: '',
    contact: '',
    memberDescription: '',
    memberLinks: '',
    memberContact: ''
  })

  const [selectedTag, setSelectedTag] = useState("Project Tags*");
  const [error, setError] = useState('');


  useEffect(() => {
    const cookieUsername = getUsernameFromCookie();
    if (cookieUsername) {
      setProjectData((prev) => ({ ...prev, creatorusername: cookieUsername || "failedtogetuser" }));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'title' && value.length > 100) {
      setError('Title cannot exceed 100 characters.');
      return;
    }
    if (field === 'description' && value.length > 800) {
      setError('Description cannot exceed 800 characters.');
      return;
    }
    setProjectData({ ...projectData, [field]: value });
    setError('');
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setProjectData({ ...projectData, tag });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (
        !projectData.tag ||
        selectedTag === "Project Tags*" ||
        !projectData.title.trim() ||
        !projectData.description.trim() ||
        !projectData.creatorusername
      ) {
        setError('Required fields are missing.');
        return;
      }

      const payload = {
        creatorusername: projectData.creatorusername,
        title: projectData.title,
        description: projectData.description,
        links: projectData.links,
        contact: projectData.contact,
        memberDescription: projectData.memberDescription,
        memberLinks: projectData.memberLinks,
        memberContact: projectData.memberContact,
        tag: selectedTag,
      };

      const response = await fetch('http://127.0.0.1:5001/buildProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });


      const result = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setError(result.error || 'Failed to create project.');
      }
    } catch (err) {
      console.error('Error submitting project:', err);
      setError('An unexpected error occurred.');
    }
  };


  return (
    <>
      <Navbar />

      <h1 className="formHeader">Create Project</h1>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {selectedTag}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {["Arts/Crafts", "Business", "Coding", "Engineering", "Math", "Music", "Science", "Writing", "Other"].map((tag) => (
            <a
              className="dropdown-item"
              href="#"
              key={tag}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </a>
          ))}
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
            value={projectData.contact}
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
        {error && <div className="error">{error}</div>}

        <button
          type="submit"
          className="submit-button"
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
      {/* <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script> */}
    </>
  );
}