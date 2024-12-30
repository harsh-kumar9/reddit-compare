function EndOfScenario({ onNext}) {
    return (
      <div class="App">
        <div class="App-header">
          <p>This is the end of the scenario.</p>
          <button onClick={onNext}>Next</button>
        </div>
      </div>
    );
  }

  export default EndOfScenario;