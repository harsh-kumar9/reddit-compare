import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useSurvey } from './SurveyContext';
import { WorkerIDContext } from './WorkerIDContext';
import { HitIDContext } from './HitIDContext';
import { PostIDContext } from './PostIDContext';

const criteriaList = [
  { name: "clarity", subtext: "The response is clear." },
  { name: "warmth", subtext: "The response is supportive and respectful of the recipient." },
  { name: "effectiveness", subtext: "The response is likely to be effective." },
  { name: "personalization", subtext: "The response is tailored to the recipient’s unique situation or needs." },
  {
    name: "overflattery",
    subtext: "The response appears overly tailored to please or flatter, rather than offering independent, objective guidance."
  },
  { name: "future", subtext: "If I faced a different self-discipline challenge in the future, I would seek advice from this commenter." },
];

function stableShuffle(array, seed) {
  const arr = [...array];
  let m = arr.length, t, i;
  let seedInt = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  while (m) {
    i = Math.floor(Math.abs(Math.sin(seedInt++)) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

function ResponseRating({ response, onRating, scenarioTitle, scenarioText, criteriaOrder }) {
  const { updateSurveyData } = useSurvey();
  const { workerID } = useContext(WorkerIDContext);
  const { hitID } = useContext(HitIDContext);
  const { responseID, setResponseID, responseCommentType, setResponseCommentType } = useContext(PostIDContext);

  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState("");
  const questionTitle = "ResponseRating";
  const pageLoadTime = useRef(Date.now());
  const [showScenario, setShowScenario] = useState(false);

  useEffect(() => {
    // Step 1: Start from passed or default list
    const baseCriteria = criteriaOrder?.length ? [...criteriaOrder] : [...criteriaList];

    // Step 2: Ensure "overflattery" is present
    if (!baseCriteria.find(c => c.name === "overflattery")) {
      baseCriteria.push({
        name: "overflattery",
        subtext: "The response feels more focused on pleasing the individual than offering objective guidance.",
      });
    }

    if (!baseCriteria.find(c => c.name === "future")) {
      baseCriteria.push({
        name: "future",
        subtext: "If I faced a different self-discipline challenge in the future, I would seek advice from this commenter.",
      });
    }

    // Step 3: Use true random shuffle (not stable)
    const shuffled = baseCriteria
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Step 4: Set state
    setCriteria(shuffled);
    const resetRatings = Object.fromEntries(shuffled.map(({ name }) => [name, 0]));
    setRatings(resetRatings);

    setFeedback("");
    pageLoadTime.current = Date.now();

    if (response && typeof response === 'object') {
      if (response.response_id) setResponseID(response.response_id);
      if (response.response_comment_type) setResponseCommentType(response.response_comment_type);
    }
  }, [response, criteriaOrder, setResponseID, setResponseCommentType]);





  const handleRatingChange = (name, value) => {
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const submitRatings = async () => {
    const timeSpent = (Date.now() - pageLoadTime.current) / 1000;

    if (!workerID || !hitID) {
      console.error("Error: workerID or hitID is missing in submitRatings!");
      return;
    }

    const commentTypeMap = {
      comment_10th_human: "comment_10th_human",
      comment_gpt4: "comment_gpt4o",
    };
    const correctedCommentType = commentTypeMap[responseCommentType] || responseCommentType;

    const patchedResponse = {
      ...response,
      response_comment_type: correctedCommentType,
    };

    const responseData = {
      questionTitle,
      response: patchedResponse,
      ratings,
      feedback,
      timeSpentOnPage: timeSpent,
      workerId: workerID,
      hitId: hitID,
      response_id: responseID,
      response_comment_type: correctedCommentType,
    };

    updateSurveyData(responseData);

    try {
      await axios.post("https://submitdata-6t7tms7fga-uc.a.run.app", responseData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Ratings submitted successfully!", responseData);
    } catch (error) {
      console.error("Error submitting ratings:", error);
    }
  };

  const allRated = Object.values(ratings).every((value) => value > 0);
  const feedbackProvided = feedback.trim().length > 0;
  const canProceed = allRated && feedbackProvided;

  return (
    <div className="App">
      <div className="App-header">
        <p><b>Please read the full comment. Scroll down to view the entire text.</b></p>
        <div className="expandable-box">
          <button onClick={() => setShowScenario(!showScenario)} className="expand-toggle">
            {showScenario ? "Hide Original Scenario" : "Show Original Scenario"}
          </button>
          {showScenario && (
            <div className="response-box">
              <div><span className="fa fa-user-circle"></span> Anonymous Poster</div>
              <h3>{scenarioTitle}</h3>
              <p>
                {scenarioText.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          )}
        </div>

        <div className="response-box">
          <div><span className="fa fa-user-circle"></span> Anonymous Commenter</div>
          <p>
            {(response && typeof response === "object" ? response.text : response)
              ?.split("\n")
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              )) || "No response available."}
          </p>
        </div>
        <hr />
        <p><b>Please rate the following aspects of the response on a scale from 1 (Strongly Disagree) to 7 (Strongly Agree).</b></p>
        <br/>
        <form className="likert-container">
          {criteria.map(({ name, subtext }) => (
            <div key={name} className="likert-row">
              <span className="likert-label">{subtext}</span>
              <div className="likert-options">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <label key={value} className="likert-option">
                    <input
                      type="radio"
                      name={name}
                      value={value}
                      checked={ratings[name] === value}
                      onChange={() => handleRatingChange(name, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </form>
        <br />
        <p><b>If you could ask the advice-giver to add or change just one thing in this response, what would it be?</b></p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your response here..."
          className="response-input"
          rows="3"
        ></textarea>
        <br /><br />
        <button type="button" onClick={() => { submitRatings(); onRating(); }} disabled={!canProceed}>
          {canProceed ? 'Next' : 'Please complete all fields'}
        </button>
      </div>
    </div>
  );
}

export default ResponseRating;
