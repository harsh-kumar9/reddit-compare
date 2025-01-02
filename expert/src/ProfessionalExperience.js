import React, { useState } from 'react';
import './App.css';

function ProfessionalExperience({ onNext }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    title: '',
    professionalExperience: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    onNext();
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Demographic Information & Past Experience</h1>
        <form onSubmit={handleSubmit}>
          <div className="ageQuestion">
            <p>Please indicate your age.</p>
            <textarea
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Type your response here..."
              className="response-input"
              rows="1"
            ></textarea>
          </div>

          <div className="genderQuestion">
            <p>Please indicate your gender.</p>
            <textarea
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Type your response here..."
              className="response-input"
              rows="1"
            ></textarea>
          </div>

          <div className="professionalQuestion">
            <p>
              As part of your professional role, have you ever provided advice,
              guidance, or support to others to help them achieve a personal or
              professional goal (e.g., improving well-being, attaining
              discipline, career development, or similar)?
            </p>
            <label>
              <input
                type="checkbox"
                name="professionalExperience"
                checked={formData.professionalExperience}
                onChange={handleChange}
              />{' '}
              Yes, I have professional experience.
            </label>
          </div>

          <div className="titleQuestion">
            <p>
              If you have provided advice, guidance, or support to others in
              your professional role, please indicate your job title.
            </p>
            <textarea
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Type your response here..."
              className="response-input"
              rows="1"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={
              !formData.age.trim() || 
              !formData.gender.trim() || 
              (formData.professionalExperience && !formData.title.trim())
            }
          >
            Next
          </button>

        </form>
      </div>
    </div>
  );
}

export default ProfessionalExperience;
