import React, { useState } from 'react';
import './App.css';

function AIQuestion({ responses, onNext }) {
  const [selectedAIResponses, setSelectedAIResponses] = useState([]);

  // Handle selection of AI-generated response options
  const handleAISelection = (responseIndex) => {
    setSelectedAIResponses((prevSelected) => {
      if (prevSelected.includes("none")) {
        // If "None of the above" is selected and the user clicks another option, remove "none" and select the new option
        return [responseIndex];
      } else if (prevSelected.includes(responseIndex)) {
        // If the option is already selected, remove it
        return prevSelected.filter((index) => index !== responseIndex);
      } else {
        // Otherwise, add the new selection
        return [...prevSelected, responseIndex];
      }
    });
  };

  // Handle "None of the above" selection
  const handleNoneSelection = () => {
    setSelectedAIResponses((prevSelected) =>
      prevSelected.includes("none") ? [] : ["none"]
    );
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
        <p><b>Which response(s) do you think is most likely to be generated with an AI chatbot (such as ChatGPT)? (Hover over each option to view the full text. Select all that apply.)</b></p>
        <div className="ai-question-container">
          {responses.map((response, index) => {
            // Truncate the response to the first 10 words
            const truncatedResponse = response.split(' ').slice(0, 10).join(' ') + (response.split(' ').length > 10 ? '...' : '');

            return (
              <div key={index} className="response-box ai-option" title={response}>
                <input
                  type="checkbox"
                  id={`ai-response-${index}`}
                  value={index}
                  checked={selectedAIResponses.includes(index)}
                  onChange={() => handleAISelection(index)}
                  className="ai-checkbox"
                />
                <label htmlFor={`ai-response-${index}`} className="ai-response-text">
                  {truncatedResponse}
                </label>
              </div>
            );
          })}
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
