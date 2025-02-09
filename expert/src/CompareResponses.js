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
        <div className="responses-container">
          <div><b> Here are the responses to the same user post that you just rated. Please review them carefully and rank them from best to worst overall. In other words, which response is the most effective overall, which is the next best, and so on? Here are the responses to the same user post that you just rated. Please review them carefully and rank them from best to worst overall. In other words, which response is the most effective overall, which is the next best, and so on? (Press the response to expand and view the full text. Drag and drop the responses to rank them with 1st being the best)</b></div>
        </div>
        <br />
        <hr />
        <p>Drag and drop the responses to rank them, with 1 being the most helpful, and 4 being the least helpful.</p>
        <div className="rankings-container">
          {rankings.map((responseIndex, displayIndex) => {
            const placeNames = ["1st", "2nd", "3rd", "4th"];
            return (
              <div
                key={responseIndex}
                className={`response-box ranking-box ${expandedIndex === responseIndex ? 'expanded' : ''}`}
                draggable
                onDragStart={() => handleDragStart(displayIndex)}
                onDrop={() => handleDrop(displayIndex)}
                onDragOver={handleDragOver}
                onClick={() => toggleExpand(responseIndex)}
              >
                <span className="placement-label">{placeNames[displayIndex]}:</span>
                <span className="response-text">
                  {expandedIndex === responseIndex ? responses[responseIndex] : responses[responseIndex].split('. ')[0]}
                </span>
                <span className="drag-icon">↕</span> {/* Drag icon */}
              </div>
            );
          })}
        </div>
        <br></br>

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
