import React, { useState } from 'react';
import './App.css';

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

  const getPreviewText = (text) => {
    const truncatedText = text.split('. ')[0]; // Take the first sentence
    return truncatedText.length > 100 ? `${truncatedText.slice(0, 100)}...` : truncatedText;
  };

  return (
    <div className="compare-responses-container">
      <div className="App-header">
        <h2>Compare Responses</h2>
        <br />
        <div className="responses-container">
          {responses.map((response, index) => (
            <div
              key={index}
              className="response-box"
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.3s ease',
                width: '100%', // Ensure all boxes are the same width
                maxWidth: '600px',
                margin: '0 auto', // Center the boxes
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
                  alignItems: 'center',
                }}
                onClick={() => toggleExpand(index)}
              >
                <span
                  style={{
                    textAlign: 'left', // Align Response # to the left
                    width: '100%',
                  }}
                >
                  Response {index + 1}
                  {expandedIndex !== index && (
                    <div
                      style={{
                        fontWeight: 'normal',
                        fontSize: '0.9rem',
                        color: '#666',
                        marginTop: '5px',
                        whiteSpace: 'nowrap', // Prevent overflow
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {getPreviewText(response)}
                    </div>
                  )}
                </span>
                <span style={{ fontSize: '1.5rem', marginLeft: '10px' }}>
                  {expandedIndex === index ? '−' : '+'}
                </span>
              </div>
              {expandedIndex === index && (
                <p
                  style={{
                    marginTop: '10px',
                    transition: 'all 0.3s ease-in-out',
                    textAlign: 'left',
                    whiteSpace: 'normal', // Prevent long text from breaking the boundary
                    wordWrap: 'break-word', // Ensure text wraps within the box
                  }}
                >
                  {response}
                </p>
              )}
            </div>
          ))}
        </div>
        <br />

        <p>Please select the response that you think is the <b>most helpful.</b></p>
        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px', width: '100%' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
              }}
            >
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

        <br />
        <p>Please select the response that you think is the <b>least helpful.</b></p>

        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px', width: '100%' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
              }}
            >
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
