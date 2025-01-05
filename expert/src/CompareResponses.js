import React, { useState } from 'react';

function CompareResponses({ responses, onNext }) {
  const [mostHelpfulIndex, setMostHelpfulIndex] = useState(null);
  const [leastHelpfulIndex, setLeastHelpfulIndex] = useState(null);
  const [mostHelpfulReason, setMostHelpfulReason] = useState('');
  const [leastHelpfulReason, setLeastHelpfulReason] = useState('');

  const handleNext = () => {
    if (typeof onNext === 'function') {
      // Pass the selected indices and reasons to the parent component
      onNext({
        mostHelpfulIndex,
        leastHelpfulIndex,
        mostHelpfulReason,
        leastHelpfulReason,
      });
    } else {
      console.error('onNext is not a function');
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h2>Compare Responses</h2>
      <br></br>
      <div className="responses-container">
        {responses.map((response, index) => (
          <div key={index} className="response-box">
            <p>{response}</p>
            {index < responses.length - 1 && <div className="vertical-divider"></div>} {/* Add a vertical line between responses */}
          </div>
        ))}
      </div>
      <br></br>

        <p>Please select the response that you think is the <b>most helpful.</b></p>
        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="radio"
                name="mostHelpful"
                value={index}
                checked={mostHelpfulIndex === index}
                onChange={() => setMostHelpfulIndex(index)} // Only update state
              />
              {response}
            </label>
          </div>
        ))}


        <p>Please write a short (1-2 sentence) response describing your choice of the most helpful response.</p>
        <textarea
          value={mostHelpfulReason}
          onChange={(e) => setMostHelpfulReason(e.target.value)}
          placeholder="Type your response here..."
          className="response-input"
          rows="1"
        ></textarea>


        <br></br>
        <p>Please select the response that you think is the <b>least helpful.</b></p>

        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="radio"
                name="leastHelpful"
                value={index}
                checked={leastHelpfulIndex === index}
                onChange={() => setLeastHelpfulIndex(index)} // Only update state
              />
              {response}
            </label>
          </div>
        ))}

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
          disabled={
            mostHelpfulIndex === null ||
            leastHelpfulIndex === null ||
            mostHelpfulReason.trim() === '' ||
            leastHelpfulReason.trim() === ''
          }
          style={{ marginTop: '20px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CompareResponses;