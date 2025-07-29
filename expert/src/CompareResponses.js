import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import './App.css';
import { WorkerIDContext } from './WorkerIDContext'; // Import the WorkerID context
import { HitIDContext } from './HitIDContext'; // Import the HitID context
import { PostIDContext } from './PostIDContext';  // <-- new import

function CompareResponses({ responses, onNext }) {
  const [rankings, setRankings] = useState(responses.map((_, index) => index));
  const [mostHelpfulReason, setMostHelpfulReason] = useState('');
  const [leastHelpfulReason, setLeastHelpfulReason] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { workerID } = useContext(WorkerIDContext);
  const { hitID } = useContext(HitIDContext);
  const { responseID, setResponseID, responseCommentType, setResponseCommentType } = useContext(PostIDContext);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedAIResponses, setSelectedAIResponses] = useState([]);
  const questionTitle = "CompareResponses";

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

    // Mapping rankings to comment types
    const rankedCommentTypes = rankings.map((responseIndex) => responses[responseIndex]?.response_comment_type || "unknown");

    const responseData = {
      questionTitle,
      rankings,
      rankedCommentTypes,  // <-- Added mapping of rankings to comment types
      mostHelpfulReason,
      leastHelpfulReason,
      selectedAIResponses,
      timeSpentOnPage: timeSpent,
      workerId: workerID,
      hitId: hitID,
      response_id: responseID,
      response_comment_type: responseCommentType
    };

    console.log("Submitting Rankings Data:", responseData);

    try {
      await axios.post(
        "https://submitdata-6t7tms7fga-uc.a.run.app",
        responseData,
        { headers: { "Content-Type": "application/json" } }
      );
      
      // 2nd DB call (example: backup endpoint or audit log)
      await axios.post(
        "https://submitdata-backup-6t7tms7fga-uc.a.run.app",
        responseData,
        { headers: { "Content-Type": "application/json" } }
      );
    console.log("Both DB calls submitted successfully!", responseData);
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
            <div> Here are the responses to the same user post that you just rated. <b>Please review them carefully and rank them from best to worst overall</b>. In other words, which response is the <b>most effective overall</b>, which is the next best, and so on? (Click each box to expand and view the full text. <b>Drag and drop the responses to rank them with 1st being the best)</b></div>
          </div>
          <br />
          <hr />
          <p>Drag and drop the responses to rank them, with 1 being the most helpful, and 4 being the least helpful.</p>
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
                      ? responses[responseIndex].text
                      : responses[responseIndex].text.split(' ').slice(0, 5).join(' ') + (responses[responseIndex].text.split(' ').length > 5 ? '...' : '')}
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

export default CompareResponses;
