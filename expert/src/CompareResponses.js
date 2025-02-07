import React, { useState } from 'react';
import './App.css';

function RankResponses({ responses, onNext }) {
  const [rankings, setRankings] = useState(responses.map((_, index) => index));
  const [mostHelpfulReason, setMostHelpfulReason] = useState('');
  const [leastHelpfulReason, setLeastHelpfulReason] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

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
    if (typeof onNext === 'function') {
      onNext({ rankings, mostHelpfulReason, leastHelpfulReason });
    } else {
      console.error('onNext is not a function');
    }
  };

  return (
    <div className="compare-responses-container">
      
      <div className="App-header">
        <h2>Compare Responses</h2>
        <div className="responses-container">
          <div><b> “Here are the responses to the same user post. Please read them carefully and rank them from best to worst overall. In other words, which response is the most effective overall, which is the next best, and so on?”</b></div>
          <i>{responses.map((response, index) => (
            <div
              key={index}
              className="response-box"
            >
              <div
                className="response-header"
                onClick={() => toggleExpand(index)}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Response {index + 1} {expandedIndex === index ? '−' : '+'}
              </div>
              {expandedIndex !== index && (
                <div
                  style={{
                    fontWeight: 'normal',
                    fontSize: '0.9rem',
                    color: '#666',
                    marginTop: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {response.split('. ')[0]}
                </div>
              )}
              {expandedIndex === index && (
                <p>{response}</p>
              )}
            </div>
          ))}</i>
        </div>
        <br />
        <hr></hr>
        <p>Drag and drop the responses to rank them, with 1 being the most helpful, and 4 being the least helpful.</p>
        <div className="rankings-container">
          {rankings.map((responseIndex, displayIndex) => {
            const placeNames = ["1st", "2nd", "3rd", "4th"];
            return (
              <div
                key={responseIndex}
                className="response-box ranking-box"
                draggable
                onDragStart={() => handleDragStart(displayIndex)}
                onDrop={() => handleDrop(displayIndex)}
                onDragOver={handleDragOver}
              >
                <span className="placement-label">{placeNames[displayIndex]}:</span>
                <span className="response-text">
                  {responses[responseIndex].split('. ')[0]} {/* Show only first sentence */}
                </span>
                <span className="drag-icon">↕</span> {/* Drag icon */}
              </div>
            );
          })}
        </div>
        <br></br>
        <p>Please write a short (1-2 sentence) response describing your choice of the most helpful response.</p>
      
        <textarea
          value={mostHelpfulReason}
          onChange={(e) => setMostHelpfulReason(e.target.value)}
          placeholder="Type your response here..."
          className="response-input"
          rows="1"
        ></textarea>
        <p>Please write a short (1-2 sentence) response describing your choice of the least helpful response.</p>
        <textarea
          value={leastHelpfulReason}
          onChange={(e) => setLeastHelpfulReason(e.target.value)}
          placeholder="Type your response here..."
          className="response-input"
          rows="1"
        ></textarea>
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

export default RankResponses;
