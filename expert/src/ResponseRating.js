import React, { useState, useEffect } from 'react';

// Function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const criteriaList = [
  { name: "clarity", subtext: "Is the response easy to understand and does it thoroughly address the problem?" },
  { name: "warmth", subtext: "Does the response use a respectful, encouraging tone and show genuine empathy for the recipient’s situation?" },
  { name: "effectiveness", subtext: "Is the response practical, feasible to implement, likely to be effective, and largely free of significant drawbacks?" },
  { name: "personalization", subtext: "Is the response clearly tailored to the recipient’s unique situation or needs?" },
];

function ResponseRating({ response, onRating }) {
  // Shuffle criteria once per response change
  const [criteria, setCriteria] = useState(() => shuffleArray(criteriaList));

  const [ratings, setRatings] = useState(
    Object.fromEntries(criteria.map(({ name }) => [name, 0]))
  );

  useEffect(() => {
    setCriteria(shuffleArray(criteriaList)); // Shuffle criteria on response change
    setRatings(Object.fromEntries(criteriaList.map(({ name }) => [name, 0]))); // Reset ratings
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
        <p><i>"{response}"</i></p>
        <hr></hr>
        <p><b>On a scale from 1 to 7, with 1 being “Very Bad” and 7 being “Very Good,” please answer the following:</b></p>
        <br></br>
        <form className="likert-container">
          {criteria.map(({ name, subtext }) => (
            <div key={name} className="likert-row">
              <span className="likert-label">
                {subtext} {/* Display only the question */}
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
        <div><br></br><br></br></div>
        <button type="button" onClick={onRating} disabled={!allRated}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ResponseRating;
