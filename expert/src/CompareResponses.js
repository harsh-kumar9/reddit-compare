import React, { useState } from 'react';

function CompareResponses({ responses, onNext }) {
  const [mostHelpfulIndex, setMostHelpfulIndex] = useState(null);
  const [leastHelpfulIndex, setLeastHelpfulIndex] = useState(null);
  const [mostHelpfulReason, setMostHelpfulReason] = useState('');
  const [leastHelpfulReason, setLeastHelpfulReason] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleNext = () => {
    if (typeof onNext === 'function') {
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
        <div className="responses-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          {responses.map((response, index) => (
            <div 
              key={index} 
              className="response-box" 
              style={{ 
                border: '1px solid #ccc', 
                borderRadius: '5px', 
                padding: '10px', 
                width: '100%', 
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.3s ease',
              }}
            >
              <div
                className="response-header"
                style={{ 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  marginBottom: '10px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
                onClick={() => toggleExpand(index)}
              >
                <span>Response {index + 1}</span>
                <span style={{ fontSize: '1.5rem' }}>
                  {expandedIndex === index ? '−' : '+'}
                </span>
              </div>
              {expandedIndex === index && (
                <p style={{ marginLeft: '20px', transition: 'all 0.3s ease-in-out', textAlign: 'left' }}>{response}</p>
              )}
            </div>
          ))}
        </div>
        <br></br>

        <p>Please select the response that you think is the <b>most helpful.</b></p>
        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px', width: '100%' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
              <input
                type="radio"
                name="mostHelpful"
                value={index}
                checked={mostHelpfulIndex === index}
                onChange={() => setMostHelpfulIndex(index)}
              />
              Response {index + 1}
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
          style={{ width: '100%' }}
        ></textarea>

        <br></br>
        <p>Please select the response that you think is the <b>least helpful.</b></p>

        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px', width: '100%' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
              <input
                type="radio"
                name="leastHelpful"
                value={index}
                checked={leastHelpfulIndex === index}
                onChange={() => setLeastHelpfulIndex(index)}
              />
              Response {index + 1}
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
          style={{ width: '100%' }}
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
          style={{ marginTop: '20px', width: '100%' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CompareResponses;
