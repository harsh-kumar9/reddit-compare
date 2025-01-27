import React, { useState, useEffect } from 'react';

const criteria = [
  { label: "Clarity", name: "clarity", subtext: "How clear and easy to understand is the guidance provided?" },
  { label: "Tone", name: "tone", subtext: "How respectful and encouraging is the tone of the guidance?" },
  { label: "Relevance", name: "relevance", subtext: "How relevant is the guidance to the specific problem or concern?" },
  { label: "Empathy", name: "empathy", subtext: "How much does the guidance reflect care and understanding for the recipient's situation?" },
  { label: "Feasibility", name: "feasibility", subtext: "How realistic and achievable are the suggested actions?" },
  { label: "Thoroughness", name: "thoroughness", subtext: "How well does the guidance comprehensively address the problem?" },
  { label: "Personalization", name: "personalization", subtext: "How well is the guidance tailored to the recipient's unique situation?" },
  { label: "Efficacy", name: "efficacy", subtext: "How likely is the guidance to effectively solve the problem?" },
  { label: "Absence of Limitations", name: "absence_of_limitations", subtext: "How free of significant drawbacks or limitations is the guidance?" },
];

function ResponseRating({ response, onRating }) {
  const [ratings, setRatings] = useState(
    Object.fromEntries(criteria.map(({ name }) => [name, 0]))
  );

  useEffect(() => {
    setRatings(Object.fromEntries(criteria.map(({ name }) => [name, 0])));
  }, [response]);

  const handleRatingChange = (name, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [name]: value,
    }));
  };

  const allRated = Object.values(ratings).every((value) => value > 0);

  return (
    <div className="App">
      <div className="App-header">
        <p><b>Please read and rate the following response.</b></p>
        <p>{response}</p>
        <p>On a scale from 1 to 7, with 1 being “Very Bad” and 7 being “Very Good,” please answer the following:</p>
        <form className="likert-container">
          {criteria.map(({ label, name, subtext }) => (
            <div key={name} className="likert-row">
              <span className="likert-label">
                {label}
                <span className="likert-subtext" style={{ fontWeight: "normal", fontSize: "0.9em", display: "block" }}>
                  ({subtext})
                </span>
              </span>
              <div className="likert-options">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <label key={value} className="likert-option">
                    <input
                      type="radio"
                      name={name}
                      value={value}
                      checked={ratings[name] === value}
                      onChange={() => handleRatingChange(name, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </form>
        <div><br></br></div>
        <button type="button" onClick={onRating} disabled={!allRated}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ResponseRating;
