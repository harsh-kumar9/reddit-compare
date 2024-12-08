import React from 'react';

function Instructions({ onNext }) {
  return (
    <div>
      <h1>Welcome to the Survey</h1>
      <p>Please read the following instructions carefully before proceeding.</p>
      <ul>
        <li>Ensure you understand the questions fully.</li>
        <li>Your responses will be kept confidential.</li>
        <li>You can quit the survey at any time.</li>
      </ul>
      <button onClick={onNext}>Start Survey</button>
    </div>
  );
}

export default Instructions;