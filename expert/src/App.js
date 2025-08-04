import React, { useState, useEffect, useContext } from 'react';
import { SurveyProvider, useSurvey } from './SurveyContext';
import { WorkerIDProvider, WorkerIDContext } from './WorkerIDContext';
import { HitIDProvider, HitIDContext } from './HitIDContext';
import { PostIDProvider } from './PostIDContext';  
import Captcha from './Captcha';
import Instructions from './Instructions';
import ConsentForm from './ConsentForm';
import ScenarioIntro from './ScenarioIntro';
import ScenarioText from './ScenarioText';
import ResponseIntro from './ResponseIntro';
import ResponseRating from './ResponseRating';
import AIQuestion from './AIQuestion';
import RLHFQuestions from './RLHFQuestions';
import CompareResponses from './CompareResponses';
import EndOfScenario from './EndOfScenario';
import ProfessionalExperience from './ProfessionalExperience';
import ThankYou from './ThankYou';
import End from './End';
import '@fortawesome/fontawesome-free/css/all.min.css';
import inputData from './data/final_posts50_complete.json';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function AppContent() {
  const { updateSurveyData } = useSurvey();
  const [currentStage, setCurrentStage] = useState('captcha');
  const [scenarios, setScenarios] = useState([]); // updated to hold multiple scenarios
  const [scenarioIndex, setScenarioIndex] = useState(0); // index to track which scenario we're on
  const { workerID, setWorkerID } = useContext(WorkerIDContext);
  const { hitID, setHitID } = useContext(HitIDContext);
  const [shuffledCriteria, setShuffledCriteria] = useState([]);
  

  const criteriaList = [
    { name: "clarity", subtext: "The response is clear and thoroughly addresses the problem." },
    { name: "warmth", subtext: "The response is supportive and respectful of the recipient." },
    { name: "effectiveness", subtext: "The response is likely to be effective." },
    { name: "personalization", subtext: "The response is tailored to the recipient’s unique situation or needs." },
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get("assignmentId") || "test";
    const hitId = urlParams.get("hitId") || "test" + Math.floor(Math.random() * 10000);
    const workerId = urlParams.get("workerId") || "test" + Math.floor(Math.random() * 10000);
    setWorkerID(workerId);
    setHitID(hitId);

    const prolificData = { assignmentId, hitId, workerId };

    fetch('https://submitdata-6t7tms7fga-uc.a.run.app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prolificData),
    }).catch((error) => console.error('Error sending prolific info:', error));

    // generate 2 distinct random scenarios
    const getTwoRandomScenarios = (data) => {
      const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
      const first = shuffled[0];
      const second = shuffled.find(p => p.id !== first.id);
      
      const formatScenario = (post) => ({
        text: post.body,
        title: post.title,
        responses: shuffleArray([
          { text: post.comments.best_comment, response_id: post.id, response_comment_type: "comment_best_human" },
          { text: post.comments.percentile_10_comment, response_id: post.id, response_comment_type: "comment_10th_human" },
          { text: post.comments.comment_o3, response_id: post.id, response_comment_type: "comment_o3" },
          { text: post.comments.comment_gpt4dot1, response_id: post.id, response_comment_type: "comment_gpt4dot1" }
        ])
      });

      return [formatScenario(first), formatScenario(second)];
    };

    setScenarios(getTwoRandomScenarios(inputData)); // set both scenarios

    // shuffle criteria for user
    if (workerId) {
      const shuffled = stableShuffle(criteriaList, workerId);
      setShuffledCriteria(shuffled);
    }
  }, [setWorkerID, setHitID]); // you may add criteriaList to fix lint

  // ✅ Added handleNextStage function to replace the broken inline logic
  const handleNextStage = (data) => {
    if (data) {
      updateSurveyData(data);
    }

    const stages = [
      'captcha', 'instructions', 'consent', 'scenarioIntro', 'scenarioText',
      'responseIntro', 'responseRating1', 'responseRating2', 'responseRating3',
      'responseRating4', 'compareResponses', 'RLHFQuestions', 'endOfScenario',
      'AIQuestion', 
      'professionalExperience', 'thankYou', 'end'
    ];


    const nextStageIndex = stages.indexOf(currentStage) + 1;

    if (nextStageIndex < stages.length) {
      const nextStage = stages[nextStageIndex];

      // ✅ Switch to 2nd scenario after finishing first
      if (currentStage === 'endOfScenario' && scenarioIndex === 0) {
        setScenarioIndex(1);
        setCurrentStage('scenarioIntro');
      } else {
        setCurrentStage(nextStage);
      }
    }
  };

  return (
    <div>
      {currentStage === 'captcha' && <Captcha onNext={handleNextStage} />}
      {currentStage === 'instructions' && <Instructions onNext={handleNextStage} />}
      {currentStage === 'consent' && <ConsentForm onConsent={handleNextStage} />}
      {currentStage === 'scenarioIntro' && <ScenarioIntro onNext={handleNextStage} scenarioNumber={scenarioIndex + 1} />} {/* Updated to show scenario number */}
      {currentStage === 'scenarioText' && scenarios.length > 0 && (
        <ScenarioText
          title={scenarios[scenarioIndex].title}
          text={scenarios[scenarioIndex].text}
          onNext={handleNextStage}
        />
      )}
      {currentStage === 'responseIntro' && <ResponseIntro onNext={handleNextStage} />}
      {/* ✅ Updated condition: replaced `scenario` with `scenarios.length > 0` */}
      {['responseRating1', 'responseRating2', 'responseRating3', 'responseRating4'].includes(currentStage) && scenarios.length > 0 && (
        <ResponseRating
          response={scenarios[scenarioIndex].responses[parseInt(currentStage.slice(-1), 10) - 1]}
          scenarioTitle={scenarios[scenarioIndex].title}
          scenarioText={scenarios[scenarioIndex].text}
          onRating={handleNextStage}
          workerId={workerID}
          hitId={hitID}
          criteriaOrder={shuffledCriteria}
        />
      )}
      {currentStage === 'compareResponses' && scenarios[scenarioIndex] && (
        <CompareResponses responses={scenarios[scenarioIndex].responses} onNext={handleNextStage} />
      )}
      {currentStage === 'RLHFQuestions' && scenarios[scenarioIndex] && (
        <RLHFQuestions responses={scenarios[scenarioIndex].responses} onNext={handleNextStage} />
      )}
      {currentStage === 'endOfScenario' && <EndOfScenario onNext={handleNextStage} />}
      {currentStage === 'AIQuestion' && scenarios.length === 2 && (
        <AIQuestion
          responses={[...scenarios[0].responses, ...scenarios[1].responses]}
          onNext={handleNextStage}
        />
      )}
      {currentStage === 'professionalExperience' && <ProfessionalExperience onNext={handleNextStage} />}
      {currentStage === 'thankYou' && <ThankYou onNext={handleNextStage} />}
      {currentStage === 'end' && <End />}
    </div>
  );
}

function App() {
  return (
    <SurveyProvider>
      <WorkerIDProvider>
        <HitIDProvider>
          <PostIDProvider>
            <AppContent />
          </PostIDProvider>
        </HitIDProvider>
      </WorkerIDProvider>
    </SurveyProvider>
  );
}

export default App;
