import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ThankYou() {
  const [formData, setFormData] = useState({
    AIUsage: 0, // Default value for AI usage
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Likert scale labels
  const likertLabels = [
    "No, never",
    "Yes, once",
    "Yes, occasionally",
    "Yes, regularly"
  ];

  // Handle AI usage selection
  const handleAIUsageChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      AIUsage: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await axios.post(
        "https://submitdata-6t7tms7fga-uc.a.run.app", // 🔄 Replace with your function URL
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
          {/* AI Chatbot Usage Frequency (Likert Scale) */}
          <div className="professionalQuestion">
            <p><b>Have you ever used large language models (such as ChatGPT)?</b></p>
            <div className="likert-container">
              <span className="likert-label">Please select one.</span>
              <div className="likert-options">
                {likertLabels.map((label, index) => (
                  <label key={index} className="likert-option">
                    <input
                      type="radio"
                      name="AIUsage"
                      value={index}
                      checked={formData.AIUsage === index}
                      onChange={() => handleAIUsageChange(index)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
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
