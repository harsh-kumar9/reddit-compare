import React, { useState } from 'react';
import './App.css';

function AIQuestion({ responses, onNext }) {
  const [selectedAIResponses, setSelectedAIResponses] = useState([]);

  // Handle checkbox selection for AI-generated question
  const handleAISelection = (responseIndex) => {
    if (selectedAIResponses.includes(responseIndex)) {
      setSelectedAIResponses(selectedAIResponses.filter((index) => index !== responseIndex));
    } else {
      setSelectedAIResponses([...selectedAIResponses, responseIndex]);
    }
  };

  // Ensure "None of the above" clears all other selections
  const handleNoneSelection = () => {
    if (selectedAIResponses.includes("none")) {
      setSelectedAIResponses([]);
    } else {
      setSelectedAIResponses(["none"]);
    }
  };

  const handleNext = () => {
    if (typeof onNext === 'function') {
      onNext({ selectedAIResponses });
    } else {
      console.error('onNext is not a function');
    }
  };

  return (
    <div className="compare-responses-container">
      <div className="App-header">
        {/* AI-Generated Response Question */}
        <p><b>Which response(s) do you think is most likely to be generated with an AI chatbot (such as ChatGPT)? (Select all that apply)</b></p>
        <div className="ai-question-container">
          {responses.map((response, index) => (
            <div key={index} className="response-box ai-option">
              <input
                type="checkbox"
                id={`ai-response-${index}`}
                value={index}
                checked={selectedAIResponses.includes(index)}
                onChange={() => handleAISelection(index)}
                disabled={selectedAIResponses.includes("none")}
                className="ai-checkbox"
              />
              <label htmlFor={`ai-response-${index}`} className="ai-response-text">{response.split('. ')[0]}...</label>
            </div>
          ))}
          {/* None of the Above Option */}
          <div className="response-box ai-option">
            <input
              type="checkbox"
              id="ai-none"
              value="none"
              checked={selectedAIResponses.includes("none")}
              onChange={handleNoneSelection}
              className="ai-checkbox"
            />
            <label htmlFor="ai-none" className="ai-response-text">None of the above</label>
          </div>
        </div>
        <br />

        <button
          type="button"
          onClick={handleNext}
          style={{ marginTop: '20px', width: '100%' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AIQuestion;
