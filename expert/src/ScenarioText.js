import React, { useState } from 'react';


function ScenarioText({title, text, onNext}) {
    const [advice, setAdvice] = useState('');

    // Correct the form submission to prevent default form behavior
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Advice submitted:', advice);
        onNext();
    };

    return (
      <div class="App">
        <div class="App-header">
          <h2>Please read the following post.</h2>
          <p>Title: {title}</p>
          <p>{text}</p>
          <p><b>What advice would you offer to this person? Imagine you came across this post on a social media forum and were writing a thoughtful comment in response.</b></p>
          <p>(Note: Please avoid using ChatGPT or other AI tools to draft your response, as doing so could significantly affect the accuracy of our research results.)</p>
          <form onSubmit={handleSubmit}>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="Type your response here..."
              className="response-input"
              rows="6" >
            </textarea>
            <p></p>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }


  export default ScenarioText;