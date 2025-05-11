import React from 'react';

function ScenarioIntro({ scenarioNumber, onNext}) {
  return (
    <div className="App">
      <div className="App-header">
        <h1>We will now begin the scenario.</h1>
        <p>Please take a moment to carefully read the following post from someone seeking advice.</p>
        <button onClick={onNext}>Begin</button>
      </div>
    </div>
  );
}

export default ScenarioIntro;