import React from 'react';

function ScenarioIntro({ scenarioNumber, onNext }) {
  const scenarioText =
    scenarioNumber === 1
      ? 'We will now present the first scenario.'
      : 'We will now present the second scenario.';

  return (
    <div className="App">
      <div className="App-header">
        <h1>{scenarioText}</h1>
        <p>Please take a moment to carefully read the following post from someone seeking advice.</p>
        <button onClick={onNext}>Begin</button>
      </div>
    </div>
  );
}

export default ScenarioIntro;
