import React, { useState, useEffect } from 'react';

const criteria = [
  { label: "Clarity", name: "clarity" },
  { label: "Tone", name: "tone" },
  { label: "Relevance", name: "relevance" },
  { label: "Empathy", name: "empathy" },
  { label: "Actionability", name: "actionability" },
  { label: "Creativity", name: "creativity" },
  { label: "Thoroughness", name: "thoroughness" },
  { label: "Personalization", name: "personalization" }
];

function ResponseRating({ response, onRating }) {
  const [ratings, setRatings] = useState({
    clarity: 0,
    tone: 0,
    relevance: 0,
    empathy: 0,
    actionability: 0,
    creativity: 0,
    thoroughness: 0,
    personalization: 0
  });

  // Reset ratings when response changes
  useEffect(() => {
    setRatings({
      clarity: 0,
      tone: 0,
      relevance: 0,
      empathy: 0,
      actionability: 0,
      creativity: 0,
      thoroughness: 0,
      personalization: 0
    });
  }, [response]); // Dependency on response ensures it resets every time the response changes

  // Function to handle rating change
  const handleRatingChange = (name, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [name]: value
    }));
  };

  // Check if all criteria have been rated (none should be 0)
  const allRated = Object.values(ratings).every(value => value > 0);

  return (
    <div>
      <p>{response}</p>
      <form>
        {criteria.map(({ label, name }) => (
          <div key={name}>
            <h4>{label}</h4>
            <div>
              {[1, 2, 3, 4, 5, 6, 7].map(value => (
                <label key={value}>
                  {value}
                  <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={ratings[name] === value}
                    onChange={() => handleRatingChange(name, value)}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={onRating} disabled={!allRated}>
          Next
        </button>
      </form>
    </div>
  );
}

export default ResponseRating;