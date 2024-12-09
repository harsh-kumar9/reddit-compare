import React from 'react';

function ScenarioIntro({ scenarioNumber, onNext}) {
  return (
    <div>
      <h1>Welcome to Scenario {scenarioNumber}</h1>
      <p>We will now begin scenario {scenarioNumber}.</p>
      <button onClick={onNext}>Begin</button>
    </div>
  );
}

export default ScenarioIntro;