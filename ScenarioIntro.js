import React from 'react';

function ScenarioIntro({ scenarioNumber, onNext}) {
  return (
    <div className="App">
      <div className="App-header">
        <h1>Scenario {scenarioNumber} - Please take a moment to carefully read the following post from someone seeking advice.</h1>
        <p>We will now begin Scenario {scenarioNumber}.</p>
        <p>By clicking the button below, you will be shown the narrative of the story.
        </p>
        <button onClick={onNext}>Begin</button>
      </div>
    </div>
  );
}

export default ScenarioIntro;