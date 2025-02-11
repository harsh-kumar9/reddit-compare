import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ThankYou() {
  const [formData, setFormData] = useState({
    AIUsage: '',
    toolDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.AIUsage || !formData.toolDetails.trim()) {
      alert("Please answer all questions before proceeding.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        "https://creative-gpt.azurewebsites.net/api/httptrigger2?code=SfnloefDXU04OK8Ao4QAvrwDRNIBeoDKWmco5VKt33xSAzFukmwSbw%3D%3D",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Redirect to Prolific
      window.location.href = 'https://app.prolific.com/submissions/complete?cc=C13Q7C8J';
    } catch (error) {
      alert("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <form onSubmit={handleSubmit}>
          <div className="professionalQuestion">
            <p><b>Do you use AI Chatbots (ChatGPT, Gemini, Claude, etc.) in your daily life or work?</b></p>
            <label className="radio-spacing">
              <input type="radio" name="AIUsage" value="Yes" checked={formData.AIUsage === 'Yes'} onChange={handleChange} />
              Yes
            </label>
            <label className="radio-spacing">
              <input type="radio" name="AIUsage" value="No" checked={formData.AIUsage === 'No'} onChange={handleChange} />
              No
            </label>
          </div>

          <div className="professionalQuestion">
            <p><b>If 'Yes', which AI tools do you use most and how often? If 'No', reply "N/A".</b></p>
            <textarea name="toolDetails" value={formData.toolDetails} onChange={handleChange} className="response-input" rows="3"></textarea>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ThankYou;
