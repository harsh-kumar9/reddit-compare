import React from 'react';
import './App.css';

function ProfessionalExperience({ onNext }) {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    onNext(); // Proceed to the next stage
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Past Experience</h1>
        <p>
          As part of your professional role, have you ever provided advice, guidance, or support to others to help them achieve a personal or professional goal (e.g., improving well-being, attaining discipline, career development, or similar)?
        </p>
        <label>
          <input type="checkbox" /> Yes, I have professional experience.
        </label>
        <p></p>
        <label>
          <input type="checkbox" /> No, I do not have professional experience.
        </label>
        <p></p>
        <form onSubmit={handleSubmit}>
          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}

export default ProfessionalExperience;
