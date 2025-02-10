import React from 'react';

function ResponseIntro({onNext}) {
  return (
    <div className="App">
      <div className="App-header">
        <p>In the next pages, you will see comments/advice responding to the post sourced from various contributors. Please assess each comment based on the provided criteria.
        </p>
        <button onClick={onNext}>Begin</button>
      </div>
    </div>
  );
}

export default ResponseIntro;