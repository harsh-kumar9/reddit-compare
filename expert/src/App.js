import React, { useState, useEffect } from 'react';
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

import inputData from './data/final_posts_cleaned.json';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function App() {
  const getRandomScenario = (data) => {
    const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
    return {
      text: shuffled[0].body,
      title: shuffled[0].title,
      responses: shuffleArray([
        shuffled[0].comments.best_comment,
        shuffled[0].comments.percentile_10_comment,
        shuffled[0].comments.gpt_comment,
        shuffled[0].comments.claude_comment,
        shuffled[0].comments.llama_comment,
        shuffled[0].comments.gemini_comment
      ])
    };
  };

  const [currentStage, setCurrentStage] = useState('captcha');
  const [scenario, setScenario] = useState(null);

  useEffect(() => {
    setScenario(getRandomScenario(inputData));
  }, []);

  const handleNextStage = () => {
    switch (currentStage) {
      case 'captcha':
        setCurrentStage('instructions');
        break;
      case 'instructions':
        setCurrentStage('consent');
        break;
      case 'consent':
        setCurrentStage('scenarioIntro');
        break;
      case 'scenarioIntro':
        setCurrentStage('scenarioText');
        break;
      case 'scenarioText':
        setCurrentStage('responseIntro');
        break;
      case 'responseIntro':
        setCurrentStage('responseRating1');
        break;
      case 'responseRating1':
        setCurrentStage('responseRating2');
        break;
      case 'responseRating2':
        setCurrentStage('responseRating3');
        break;
      case 'responseRating3':
        setCurrentStage('responseRating4');
        break;
      case 'responseRating4':
        setCurrentStage('responseRating5');
        break;
      case 'responseRating5':
        setCurrentStage('responseRating6');
        break;
      case 'responseRating6':
        setCurrentStage('compareResponses');
        break;
      case 'compareResponses':
        setCurrentStage('RLHFQuestions');
        break;
      case 'RLHFQuestions':
        setCurrentStage('AIQuestion');
        break;
      case 'AIQuestion':
        setCurrentStage('endOfScenario');
        break;
      case 'endOfScenario':
        setCurrentStage('professionalExperience'); // Moves directly to demographics
        break;
      case 'professionalExperience':
        setCurrentStage('thankYou');
        break;
      case 'thankYou':
        setCurrentStage('end');
        break;
      default:
        console.error(`Unknown stage: ${currentStage}`);
        break;
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
      {['responseRating1', 'responseRating2', 'responseRating3', 'responseRating4', 'responseRating5', 'responseRating6'].includes(currentStage) && scenario && (
        <ResponseRating
          response={scenario.responses[parseInt(currentStage.slice(-1), 10) - 1]}
          onRating={handleNextStage}
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

export default App;
