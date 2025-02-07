import React, { useState } from 'react';
import './App.css';

function RLHFQuestions({ responses = [], onNext }) {
  const [rankings, setRankings] = useState(responses.map((_, index) => index));
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedAIResponse, setSelectedAIResponse] = useState(null); // New state for AI response selection

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDrop = (targetIndex) => {
    if (draggedItem === null) return;
    const newRankings = [...rankings];
    const draggedItemValue = newRankings[draggedItem];
    newRankings.splice(draggedItem, 1);
    newRankings.splice(targetIndex, 0, draggedItemValue);
    setRankings(newRankings);
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNext = () => {
    if (selectedAIResponse === null) {
      alert("Please select the response you believe is AI-generated before proceeding.");
      return;
    }
    if (typeof onNext === 'function') {
      onNext({ rankings, selectedAIResponse });
    } else {
      console.error('onNext is not a function');
    }
  };

  const questions = [
    "Now, please think carefully about each response in terms of its longer-term impact on the person seeking help. Imagine that the person follows this advice consistently over the next few months. Considering factors such as feasibility, motivation, and sustained benefits to well-being or discipline, how would you rank these responses from most beneficial in the long run to least beneficial in the long run?",
    "If you imagine that the response might be challenging at some point, which response would be easiest to stick to despite setbacks or motivational dips? Rank these responses from easiest to difficult."
  ];

  return (
    <div className="compare-responses-container">
      <div className="App-header">
        <h2>RLHF Questions</h2>

        {/* Ranking Questions */}
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-container">
            <p><b>{question}</b></p>
            <div className="rankings-container">
              {rankings.map((responseIndex, displayIndex) => (
                <div
                  key={responseIndex}
                  className="response-box"
                  draggable
                  onDragStart={() => handleDragStart(displayIndex)}
                  onDrop={() => handleDrop(displayIndex)}
                  onDragOver={handleDragOver}
                >
                  <span className="placement-label">{displayIndex + 1}:</span>
                  <span className="response-text">{responses[responseIndex].split('. ')[0]}</span> {/* Shortened preview */}
                  <span className="drag-icon">↕</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* AI-Generated Response Question */}
        <div className="question-container">
          <p><b>Which response do you think is most likely to be generated with an AI chatbot?</b></p>
          <div className="multiple-choice-container">
            {responses.map((response, index) => (
              <label key={index} className="multiple-choice-option">
                <input
                  type="radio"
                  name="ai-response"
                  value={index}
                  checked={selectedAIResponse === index}
                  onChange={() => setSelectedAIResponse(index)}
                />
                Response {index + 1}
              </label>
            ))}
          </div>
        </div>

        <br></br>
        <button 
          type="button" 
          onClick={handleNext} 
          style={{ marginTop: '20px', width: '100%' }}
          disabled={selectedAIResponse === null} // Disable until AI response is selected
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RLHFQuestions;
