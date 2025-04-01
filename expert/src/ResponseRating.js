import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useSurvey } from './SurveyContext';
import { WorkerIDContext } from './WorkerIDContext';
import { HitIDContext } from './HitIDContext';
import { PostIDContext } from './PostIDContext';

// Function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const criteriaList = [
  { name: "clarity", subtext: "The response is clear and thoroughly addresses the problem." },
  { name: "warmth", subtext: "The response is supportive of the recipient." },
  { name: "effectiveness", subtext: "The response is likely to be effective." },
  { name: "personalization", subtext: "The response is tailored to the recipient’s unique situation or needs." },
];

function ResponseRating({ response, onRating }) {
  const { updateSurveyData } = useSurvey();
  const { workerID } = useContext(WorkerIDContext);
  const { hitID } = useContext(HitIDContext);
  const { responseID, setResponseID, responseCommentType, setResponseCommentType } = useContext(PostIDContext);
  const [criteria, setCriteria] = useState(() => shuffleArray(criteriaList));
  const [ratings, setRatings] = useState(
    Object.fromEntries(criteria.map(({ name }) => [name, 0]))
  );
  const [feedback, setFeedback] = useState("");
  const questionTitle = "ResponseRating";
  const pageLoadTime = useRef(Date.now());

  useEffect(() => {
    setCriteria(shuffleArray(criteriaList));
    setRatings(Object.fromEntries(criteria.map(({ name }) => [name, 0])));
    setFeedback("");
    pageLoadTime.current = Date.now();

    if (response && typeof response === 'object') {
      if (response.response_id) {
        setResponseID(response.response_id);
      }
      if (response.response_comment_type) {
        setResponseCommentType(response.response_comment_type);
      }
    }
  }, [response, setResponseID, setResponseCommentType]);

  const handleRatingChange = (name, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [name]: value,
    }));
  };

  const submitRatings = async () => {
    const timeSpent = (Date.now() - pageLoadTime.current) / 1000;

    if (!workerID || !hitID) {
      console.error("Error: workerID or hitID is missing in submitRatings!");
      return;
    }

    // Correct the comment type label
    const commentTypeMap = {
      comment_10th_human: "comment_90th_human",
      comment_gpt4: "comment_gpt4o",
    };
    const correctedCommentType = commentTypeMap[responseCommentType] || responseCommentType;

    // Patch the response object to reflect the corrected type
    const patchedResponse = {
      ...response,
      response_comment_type: correctedCommentType
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
      response_comment_type: correctedCommentType
    };

    updateSurveyData(responseData);

    try {
      await axios.post(
        "https://submitdata-6t7tms7fga-uc.a.run.app",
        responseData,
        { headers: { "Content-Type": "application/json" } }
      );
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
