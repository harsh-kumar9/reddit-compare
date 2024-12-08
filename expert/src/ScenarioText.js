function ScenarioText({ text, onNext}) {
    return (
      <div>
        <h2>Scenario</h2>
        <p>{text}</p>
        <button onClick={onNext}>Next</button>
      </div>
    );
  }


  export default ScenarioText;