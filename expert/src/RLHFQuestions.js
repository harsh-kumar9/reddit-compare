import React, { useState } from 'react';
import './App.css';

function RankResponses({ responses, onNext }) {
  const [rankings, setRankings] = useState(responses.map((_, index) => index));
  const [mostHelpfulReason, setMostHelpfulReason] = useState('');
  const [leastHelpfulReason, setLeastHelpfulReason] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedAIResponses, setSelectedAIResponses] = useState([]); // For AI-generated question

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
      onNext({ rankings, mostHelpfulReason, leastHelpfulReason, selectedAIResponses });
    } else {
      console.error('onNext is not a function');
    }
  };

  return (
    <div className="compare-responses-container">
      <div className="App-header">
        <div className="responses-container">
          <div><b> Now, please think carefully about each response in terms of its longer-term impact on the person seeking help. Imagine that the person follows this advice consistently over the next few months. Considering factors such as feasibility, motivation, and sustained benefits to well-being or discipline, how would you rank these responses from most beneficial in the long run to least beneficial in the long run?</b></div>
        </div>
        <br />
        <hr />
        <p>Drag and drop the responses to rank them, with 1 being the most helpful, and 6 being the least helpful.</p>
        <div className="rankings-container">
          {rankings.map((responseIndex, displayIndex) => {
            const placeNames = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
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
                  {expandedIndex === responseIndex 
                    ? responses[responseIndex] 
                    : responses[responseIndex].split(' ').slice(0, 5).join(' ') + (responses[responseIndex].split(' ').length > 5 ? '...' : '')}
                </span>
                <span className="drag-icon">↕</span> {/* Drag icon */}
              </div>
            );
          })}
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

export default RankResponses;
