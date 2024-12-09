import React from 'react';

function CompareResponses({ responses, onSelect, onNext, onPrevious }) {
    return (
        <div>
            <h2>Compare Responses</h2> {/* Title added */}
            <p>Please select the response that you think is best:</p> {/* Instructions added */}
            {responses.map((response, index) => (
                <div key={index} style={{marginBottom: '20px'}}>
                    <p>{response}</p> {/* Assuming response is just text */}
                    <button onClick={() => onSelect(index)}>Select This Response</button>
                </div>
            ))}
            <div style={{marginTop: '20px'}}>
            </div>
        </div>
    );
}

export default CompareResponses;