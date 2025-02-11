import React, { useState } from 'react';
import './App.css';

function DemographicQuestions({ onNext }) {
  const [formData, setFormData] = useState({
    yearOfBirth: '',
    educationLevel: '',
    sex: '',
    industry: '',
    professionalExperience: '',
    jobTitle: '',
    otherJobTitle: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
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
        <h1>Demographic Information</h1>
        <form onSubmit={handleSubmit}>
          {/* Year of Birth */}
          <div className="question">
            <p>Q1. What is your date of birth?</p>
            <input
              type="date"
              name="yearOfBirth"
              value={formData.yearOfBirth}
              onChange={handleChange}
              className="response-input"
            />
          </div>

          {/* Education Level */}
          <div className="question">
            <p>Q2. What is the highest level of school you have completed or the highest degree you have received?</p>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="response-input"
            >
              <option value="">Select an option</option>
              <option value="Less than high school">Less than high school degree</option>
              <option value="High school graduate">High school graduate (high school diploma or equivalent including GED)</option>
              <option value="Some college">Some college but no degree</option>
              <option value="Associate degree">Associate degree in college (2-year)</option>
              <option value="Bachelor's degree">Bachelor's degree in college (4-year)</option>
              <option value="Master's degree">Master's degree</option>
              <option value="Doctoral degree">Doctoral degree</option>
              <option value="Professional degree">Professional degree (JD, MD)</option>
            </select>
          </div>

          {/* Sex */}
          <div className="question">
            <p>Q3. What is your sex?</p>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="response-input"
            >
              <option value="">Select an option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Industry */}
          <div className="question">
            <p>Q4. Which of the following industries most closely matches the one in which you are employed?</p>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="response-input"
            >
              <option value="">Select an option</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Social Services">Social Services</option>
              <option value="Business">Business</option>
              <option value="Retail">Retail</option>
              <option value="Consulting">Consulting</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Government">Government</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Professional Experience */}
          <div className="question">
            <p>
              Q5. As part of your professional role, have you ever provided advice,
              guidance, or support to others to help them achieve a personal or
              professional goal (e.g., improving well-being, attaining
              discipline, career development, or similar)?
            </p>
            <select
              name="professionalExperience"
              value={formData.professionalExperience}
              onChange={handleChange}
              className="response-input"
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Job Title - Conditional Rendering */}
          {formData.professionalExperience === 'Yes' && (
            <div className="question">
              <p>Q6. Please indicate your occupation:</p>
              <select
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="response-input"
              >
                <option value="">Select an option</option>
                <option value="Therapist">Therapist</option>
                <option value="Social Worker">Social Worker</option>
                <option value="Personal Coach">Personal Coach</option>
                <option value="Physician">Physician</option>
                <option value="Nurse">Nurse</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Consultant">Consultant</option>
                <option value="Advisor">Advisor</option>
                <option value="Other">Other</option>
              </select>
              {formData.jobTitle === 'Other' && (
                <textarea
                  name="otherJobTitle"
                  value={formData.otherJobTitle}
                  onChange={handleChange}
                  placeholder="Please specify your job title"
                  className="response-input"
                  rows="1"
                ></textarea>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !formData.yearOfBirth.trim() ||
              !formData.educationLevel.trim() ||
              !formData.sex.trim() ||
              !formData.industry.trim() ||
              !formData.professionalExperience.trim() ||
              (formData.professionalExperience === 'Yes' &&
                (!formData.jobTitle.trim() ||
                  (formData.jobTitle === 'Other' && !formData.otherJobTitle.trim())))
            }
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default DemographicQuestions;
