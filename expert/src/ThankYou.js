import React, { useState } from 'react';
import './App.css';

function ThankYou({ onNext }) {
  const [formData, setFormData] = useState({
    AIUsage: '',
    toolDetails: '',
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
        <h1>Thank You</h1>
        <form onSubmit={handleSubmit}>
          <div className="professionalQuestion">
            <p>
              Do you utilize AI Chatbots (such as ChatGPT, Gemini, Claude, etc.) to seek assistance in your daily life or occupation?
            </p>
            <label>
              <input
                type="radio"
                name="AIUsage"
                value="Yes"
                checked={formData.AIUsage === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="AIUsage"
                value="No"
                checked={formData.AIUsage === 'No'}
                onChange={handleChange}
              />
              No
            </label>
          </div>

          <div className="professionalQuestion">
            <p>
              If you answered 'Yes' to the previous question, please indicate which tool/website you use most often, as well as approximately how many times per week you utilize these tools. If you answered 'No', please reply "N/A".
            </p>
            <textarea
              name="toolDetails"
              value={formData.toolDetails}
              onChange={handleChange}
              placeholder="Type your response here..."
              className="response-input"
              rows="3"
            ></textarea>
          </div>
          <p>Please press next to complete the survey.</p>
          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}

export default ThankYou;
