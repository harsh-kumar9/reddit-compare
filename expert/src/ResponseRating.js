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
  { name: "clarity", subtext: "The response is clear and thoroughly addresses the problem." },
  { name: "warmth", subtext: "The response is supportive of the recipient." },
  { name: "effectiveness", subtext: "The response is likely to be effective." },
  { name: "personalization", subtext: "The response is tailored to the recipient’s unique situation or needs." },
];

function ResponseRating({ response, onRating }) {
  const [criteria, setCriteria] = useState(() => shuffleArray(criteriaList));
  const [ratings, setRatings] = useState(
    Object.fromEntries(criteria.map(({ name }) => [name, 0]))
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setCriteria(shuffleArray(criteriaList));
    setRatings(Object.fromEntries(criteria.map(({ name }) => [name, 0])));
    setFeedback("");
  }, [response]); // Reset fields when a new response loads

  const handleRatingChange = (name, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [name]: value,
    }));
  };

  const allRated = Object.values(ratings).every((value) => value > 0);
  const feedbackProvided = feedback.trim().length > 0;
  const canProceed = allRated && feedbackProvided; // ✅ Button is enabled as soon as conditions are met

  return (
    <div className="App">
      <div className="App-header">
        <p><b>Please read the full comment. Scroll down to view the entire text.</b></p>
        <div className="response-box">
          <div><span className="fa fa-user-circle"></span> Anonymous Commenter</div>
          <p>
            {response.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        <hr />
        <p><b>Please rate the following aspects of the response on a scale from 1 (Strongly Disagree) to 7 (Strongly Agree).</b></p>
        <br />
        <form className="likert-container">
          {criteria.map(({ name, subtext }) => (
            <div key={name} className="likert-row">
              <span className="likert-label">{subtext}</span>
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
        <br />
        <p><b>If you could ask the advice-giver to add or change just one thing in this response, what would it be?</b></p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your response here..."
          className="response-input"
          rows="3"
        ></textarea>
        <br /><br />
        <button type="button" onClick={onRating} disabled={!canProceed}>
          {canProceed ? 'Next' : 'Please complete all fields'}
        </button>
      </div>
    </div>
  );
}

export default ResponseRating;
