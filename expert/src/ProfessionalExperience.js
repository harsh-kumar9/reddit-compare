import React, { useState , useRef} from 'react';
import axios from 'axios';
import './App.css';

function DemographicQuestions({ onNext }) {
  const [formData, setFormData] = useState({
    AIUsage: '',
    yearOfBirth: '',
    educationLevel: '',
    sex: '',
    industry: '',
    professionalExperience: '',
    jobTitle: '',
    otherJobTitle: '',
  });

  const pageLoadTime = useRef(Date.now());

  const likertLabels = [
    "No, never",
    "Yes, once",
    "Yes, occasionally",
    "Yes, regularly"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Page load time at submit: ${pageLoadTime.current}`);
    const timeSpent = (Date.now() - pageLoadTime.current) / 1000;
    console.log(`Time spent on page: ${timeSpent} seconds`);

    const updatedFormData = { ...formData, timeSpentOnPage: timeSpent };
    
    try {
      await axios.post('http://localhost:3001/demographic_info', updatedFormData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Form Data Submitted:', updatedFormData);
      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Demographic Information</h1>
        <form onSubmit={handleSubmit}>
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
              <option value="High school graduate">High school graduate</option>
              <option value="Some college">Some college but no degree</option>
              <option value="Associate degree">Associate degree</option>
              <option value="Bachelor's degree">Bachelor's degree</option>
              <option value="Master's degree">Master's degree</option>
              <option value="Doctoral degree">Doctoral degree</option>
              <option value="Professional degree">Professional degree (JD, MD)</option>
            </select>
          </div>
          
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
          
          <div className="question">
            <p>Q4. Which industry are you employed in?</p>
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
          
          <div className="question">
            <p>Q5. Have you provided professional advice or guidance?</p>
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
          
          <div className="question">
            <p>Q7. Have you ever used large language models?</p>
            <div className="likert-container-ai">
              {likertLabels.map((label, index) => (
                <label key={index} className="likert-option">
                  <input
                    type="radio"
                    name="AIUsage"
                    value={index}
                    checked={formData.AIUsage === String(index)}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>

          </div>
          
          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}

export default DemographicQuestions;
