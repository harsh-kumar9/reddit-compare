import React, { useState, useRef} from 'react';
import './App.css';
import axios from 'axios';

function AIQuestion({ responses, onNext }) {
  const [selectedAIResponses, setSelectedAIResponses] = useState([]);

  // Handle selection of AI-generated response options
  const handleAISelection = (responseIndex) => {
    setSelectedAIResponses((prevSelected) => {
      if (prevSelected.includes("none")) {
        return [responseIndex];
      } else if (prevSelected.includes(responseIndex)) {
        return prevSelected.filter((index) => index !== responseIndex);
      } else {
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

  // Time tracking
  const pageLoadTime = useRef(Date.now());

  const handleNext = async () => {
    console.log(`Page load time at submit: ${pageLoadTime}`);
    const timeSpent = (Date.now() - pageLoadTime.current) / 1000;
    console.log(`Time spent on page: ${timeSpent} seconds`);
    const data = { selectedAIResponses , timeSpentOnPage: timeSpent};
    
    try {
      await axios.post('http://localhost:3001/ai_response', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('AI response data submitted successfully!', data);

      if (typeof onNext === 'function') {
        onNext(data);
      }
    } catch (error) {
      console.error('Error sending AI response data:', error);
    }
  };


  return (
    <div className="compare-responses-container">
      <div className="App-header">
        <p><b>Which response(s) do you think is most likely to be generated with an AI chatbot (such as ChatGPT)? (Hover over each option to view the full text. Select all that apply.)</b></p>
        <div className="ai-question-container">
          {responses.map((response, index) => {
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
