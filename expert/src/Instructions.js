import React from 'react';
import './App.css';


function Instructions({ onNext }) {
  return (
    <div className="App">
      <div className="App-header">
        <h1>Welcome to the Survey</h1>
        <p>Please read the following instructions carefully before proceeding.</p>

        <p>Researchers at the University of Toronto are studying how people perceive and evaluate comments designed to help others achieve discipline or life goals. This study investigates how participants assess comments intended to provide advice or encouragement in response to real-life scenarios.</p>
        <p>You are invited to participate in this study if you are at least 18 years of age. As a participant, you will:</p>
        <ol>
          <li>Read posts where individuals share their goals or challenges.</li>
          <li>Evaluate a series of comments provided in response to the same post, based on specific dimensions such as helpfulness, relevance, and tone.</li>
          <li>Choose the comment you believe is the most effective overall.</li>
        </ol>
        <p>This process will repeat for multiple posts. By participating, you will help us better understand how comments can provide meaningful support and guidance, which may inform the design of future tools and systems.</p>

        <button onClick={onNext}>Start Survey</button>
      </div>
    </div>
  );
}

export default Instructions;