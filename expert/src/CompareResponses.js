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
          {responses.map((response, index) => (
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
          ))}
        </div>
        <br />
        <p>Drag and drop the responses to rank them, with 1 being the best.</p>
        <div className="rankings-container">
          {rankings.map((responseIndex, displayIndex) => (
            <div
              key={responseIndex}
              className="response-box"
              draggable
              onDragStart={() => handleDragStart(displayIndex)}
              onDrop={() => handleDrop(displayIndex)}
              onDragOver={handleDragOver}
              style={{ display: 'flex', alignItems: 'center', padding: '15px', gap: '10px' }}
            >
              <i className="fa-solid fa-arrows-up-down" style={{ cursor: 'grab' }}></i>
              <strong>Rank {displayIndex + 1}</strong>: {responses[responseIndex]}
            </div>
          ))}
        </div>
        <br /><br />
        <p>Please write a short (1-2 sentence) response describing your choice of the most helpful response.</p>
      
        <textarea
          value={mostHelpfulReason}
          onChange={(e) => setMostHelpfulReason(e.target.value)}
          placeholder="Type your response here..."
          className="response-input"
          rows="1"
        ></textarea>
        <br />
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
