import React, { useState, useRef, useContext, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { WorkerIDContext } from './WorkerIDContext'; // Import the WorkerID context
import { HitIDContext } from './HitIDContext'; // Import the HitID context
import { PostIDContext } from './PostIDContext'; // <-- new import

function AIQuestion({ responses, onNext }) {
  const [selectedAIResponses, setSelectedAIResponses] = useState([]);
  const { workerID } = useContext(WorkerIDContext);
  const { hitID } = useContext(HitIDContext);
  const { responseID, setResponseID, responseCommentType, setResponseCommentType } = useContext(PostIDContext);
  const questionTitle = "AIQuestion";
  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleExpand = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };
  

  // Time tracking
  const pageLoadTime = useRef(Date.now());

  // Populate responseID and responseCommentType from the first response, if present
  useEffect(() => {
    if (responses && responses.length > 0) {
      const firstResponse = responses[0];
      if (firstResponse.response_id) {
        setResponseID(firstResponse.response_id);
      }
      if (firstResponse.response_comment_type) {
        setResponseCommentType(firstResponse.response_comment_type);
      }
    }
  }, [responses, setResponseID, setResponseCommentType]);

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

  const handleNext = async () => {
    console.log(`Page load time at submit: ${pageLoadTime}`);
    const timeSpent = (Date.now() - pageLoadTime.current) / 1000;
    console.log(`Time spent on page: ${timeSpent} seconds`);

    // Mapping selected responses to comment types
    const selectedCommentTypes = selectedAIResponses.map((responseIndex) => 
      responses[responseIndex]?.response_comment_type || "unknown"
    );

    const data = {
      questionTitle,
      selectedAIResponses,
      selectedCommentTypes,  // <-- Added mapping of selected responses to comment types
      timeSpentOnPage: timeSpent,
      workerId: workerID,
      hitId: hitID,
      response_id: responseID,
      response_comment_type: responseCommentType
    };

    try {
      await axios.post('https://submitdata-6t7tms7fga-uc.a.run.app', data, {
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
        <p><b>Which response(s) do you think is most likely to be generated with an AI chatbot (such as ChatGPT)? (Press + to expand and view the full text. Select all that apply.)</b></p>
        <div className="ai-question-container">
          {responses.map((response, index) => {
            const truncatedResponse = response.text.split(' ').slice(0, 10).join(' ') + 
              (response.text.split(' ').length > 10 ? '...' : '');

              return (
                <div
                  key={index}
                  className={`response-box ai-option ${expandedIndex === index ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(index)}
                >
                  <input
                    type="checkbox"
                    id={`ai-response-${index}`}
                    value={index}
                    checked={selectedAIResponses.includes(index)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevents expansion toggle on checkbox click
                      handleAISelection(index);
                    }}
                    className="ai-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`ai-response-${index}`} className="ai-response-text">
                    {expandedIndex === index
                      ? response.text
                      : response.text.split(' ').slice(0, 10).join(' ') + (response.text.split(' ').length > 10 ? '...' : '')}
                  </label>
                  <span className="drag-icon">{expandedIndex === index ? '−' : '+'}</span>

                  
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
              onClick={(e) => e.stopPropagation()}
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
