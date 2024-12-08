function EndOfScenario({ onNext}) {
    return (
      <div>
        <p>This is the end of the scenario.</p>
        <button onClick={onNext}>Next</button>
      </div>
    );
  }

  export default EndOfScenario;