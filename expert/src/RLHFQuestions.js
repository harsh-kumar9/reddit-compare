import React, { useState, useRef, useContext} from 'react';
import axios from 'axios';
import './App.css';
import { WorkerIDContext } from './WorkerIDContext'; // Import the WorkerID context


function RLHFQuestions({ responses, onNext }) {
  const [rankings, setRankings] = useState(responses.map((_, index) => index));
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedAIResponses, setSelectedAIResponses] = useState([]);
  const { workerID } = useContext(WorkerIDContext); // Access workerID from the context
  const questionTitle = "RLHFQuestions";


  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  // Time tracking
  const pageLoadTime = useRef(Date.now());

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


  const handleNext = async () => {
    console.log(`Page load time at submit: ${pageLoadTime}`);
    const timeSpent = (Date.now() - pageLoadTime.current) / 1000;
    console.log(`Time spent on page: ${timeSpent} seconds`);
    const responseData = {questionTitle, rankings, selectedAIResponses, timeSpentOnPage: timeSpent , workerId: workerID};
    console.log("Submitting Rankings Data:", responseData);
    
    try {
      await axios.post(
        "https://submitdata-6t7tms7fga-uc.a.run.app",
        responseData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Rankings data submitted successfully!");
    } catch (error) {
      console.error("Error submitting rankings data:", error);
    }

    if (typeof onNext === 'function') {
      onNext(responseData);
    } else {
      console.error('onNext is not a function');
    }
  };

  return (
    <div className="App">
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
    </div>
  );
}

export default RLHFQuestions;
