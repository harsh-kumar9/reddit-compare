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
import inputData from './data/final_posts100_filtered_converted.json';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

//making it different
//different difference jfhakdjshfksd
function AppContent() {
  const { updateSurveyData } = useSurvey();
  const [currentStage, setCurrentStage] = useState('captcha');
  const [scenario, setScenario] = useState(null);
  const { workerID, setWorkerID } = useContext(WorkerIDContext);
  const { hitID, setHitID } = useContext(HitIDContext);
  

  useEffect(() => {
    const getRandomScenario = (data) => {
      const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
      const selected = shuffled[0];
      return {
        text: selected.body,
        title: selected.title,
        responses: shuffleArray([
          { text: selected.comments.best_comment, response_id: selected.id, response_comment_type: "comment_best_human" },
          { text: selected.comments.percentile_10_comment, response_id: selected.id, response_comment_type: "comment_10th_human" },
          { text: selected.comments.comment_o3, response_id: selected.id, response_comment_type: "comment_o3" },
          { text: selected.comments.comment_gpt4dot1, response_id: selected.id, response_comment_type: "comment_gpt4dot1"}
        ])
      };
    };
    
  
    setScenario(getRandomScenario(inputData));
  
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get("assignmentId") || "test";
    const hitId = urlParams.get("hitId") || "test" + Math.floor(Math.random() * 10000);
    const workerId = urlParams.get("workerId") || "test" + Math.floor(Math.random() * 10000);
    setWorkerID(workerId);
    setHitID(hitId);
  
    const prolificData = { assignmentId, hitId, workerId };
  
    fetch('https://submitdata-6t7tms7fga-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prolificData),
    }).catch((error) => console.error('Error sending prolific info:', error));
  }, [setWorkerID, setHitID]);
  
  
  const handleNextStage = (data) => {
    if (data) {
      updateSurveyData(data);
    }
    
  const stages = [
      'captcha', 'instructions', 'consent', 'scenarioIntro', 'scenarioText',
      'responseIntro', 'responseRating1', 'responseRating2', 'responseRating3',
      'responseRating4', 'compareResponses', 'RLHFQuestions', 'AIQuestion', 'endOfScenario',
      'professionalExperience', 'thankYou', 'end'
  ];

    const nextStageIndex = stages.indexOf(currentStage) + 1;
    if (nextStageIndex < stages.length) {
      setCurrentStage(stages[nextStageIndex]);
    }
  };

  return (
    <div>
      {currentStage === 'captcha' && <Captcha onNext={handleNextStage} />}
      {currentStage === 'instructions' && <Instructions onNext={handleNextStage} />}
      {currentStage === 'consent' && <ConsentForm onConsent={handleNextStage} />}
      {currentStage === 'scenarioIntro' && <ScenarioIntro onNext={handleNextStage} scenarioNumber={1} />}
      {currentStage === 'scenarioText' && scenario && <ScenarioText title={scenario.title} text={scenario.text} onNext={handleNextStage} />}
      {currentStage === 'responseIntro' && <ResponseIntro onNext={handleNextStage} />}
      {['responseRating1', 'responseRating2', 'responseRating3', 'responseRating4'].includes(currentStage) && scenario && (
        <ResponseRating
        response={scenario.responses[parseInt(currentStage.slice(-1), 10) - 1]}
        scenarioTitle={scenario.title}
        scenarioText={scenario.text}
        onRating={handleNextStage}
        workerId={workerID}
        hitId={hitID}
        />      
      )}
      {currentStage === 'compareResponses' && scenario && <CompareResponses responses={scenario.responses} onNext={handleNextStage} />}
      {currentStage === 'RLHFQuestions' && scenario && <RLHFQuestions responses={scenario.responses} onNext={handleNextStage} />}
      {currentStage === 'AIQuestion' && scenario && <AIQuestion responses={scenario.responses} onNext={handleNextStage} />}
      {currentStage === 'endOfScenario' && <EndOfScenario onNext={handleNextStage} />}
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
