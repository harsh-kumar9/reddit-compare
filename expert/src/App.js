import React, { useState, useEffect } from 'react';
import Instructions from './Instructions';
import ConsentForm from './ConsentForm';
import ProfessionalExperience from './ProfessionalExperience';
import ScenarioIntro from './ScenarioIntro';
import ScenarioText from './ScenarioText';
import ResponseRating from './ResponseRating';
import CompareResponses from './CompareResponses';
import EndOfScenario from './EndOfScenario';
import ThankYou from './ThankYou';
import End from './End';

import inputData from './data/input.json';

function App() {

  const getRandomScenarios = (data, count) => {
    const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(post => ({
      text: post.body,
      title: post.title,
      responses: [
        post.comments.best_comment,
        post.comments.percentile_10_comment,
        post.comments.gpt_comment,
        post.comments.claude_comment
      ]
    }));
  };

  const [currentStage, setCurrentStage] = useState('instructions');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [userInputs, setUserInputs] = useState([]);

  useEffect(() => {
    const selectedScenarios = getRandomScenarios(inputData, 3);  // Get 3 random posts
    setScenarios(selectedScenarios);
  }, []);

  const handleNextStage = () => {
    switch (currentStage) {
      case 'instructions':
        setCurrentStage('consent');
        break;
      case 'consent':
        setCurrentStage('professionalExperience');
        break;
      case 'professionalExperience':
        setCurrentStage('scenarioIntro');
        break;
      case 'scenarioIntro':
        setCurrentStage('scenarioText');
        break;
      case 'scenarioText':
        setCurrentStage('responseRating1');
        break;
      case 'responseRating1':
        setCurrentStage('responseRating2');
        break;
      case 'responseRating2':
        setCurrentStage('responseRating3');
        break;
      case 'responseRating3':
          setCurrentStage('responseRating4');  // New stage for the 4th response
          break;
      case 'responseRating4':
        setCurrentStage('compareResponses');
        break;
      case 'compareResponses':
        setCurrentStage('endOfScenario');
        break;
      case 'endOfScenario':
        if (currentScenarioIndex < scenarios.length - 1) {
          setCurrentScenarioIndex(currentScenarioIndex + 1);
          setCurrentStage('scenarioIntro');
        } else {
          setCurrentStage('thankYou');
        }
        break; // Added break here to prevent falling into the next case
      case 'thankYou':
        setCurrentStage('end');
        break;
      default:
        console.error(`Unknown stage: ${currentStage}`);
        break; // Keep the current stage unchanged
    }
  };
  

  return (
    <div>
      {currentStage === 'instructions' && <Instructions onNext={handleNextStage} />}
      {currentStage === 'consent' && <ConsentForm onConsent={handleNextStage} />}
      {currentStage === 'professionalExperience' && <ProfessionalExperience onNext={handleNextStage} />}
      {currentStage === 'scenarioIntro' && <ScenarioIntro onNext={handleNextStage} scenarioNumber={currentScenarioIndex + 1} />}
      {currentStage === 'scenarioText' && <ScenarioText title={scenarios[currentScenarioIndex].title} text={scenarios[currentScenarioIndex].text} onNext={handleNextStage} />}
      {['responseRating1', 'responseRating2', 'responseRating3', 'responseRating4'].includes(currentStage) && scenarios.length > 0 && (
        <ResponseRating
          response={scenarios[currentScenarioIndex].responses[parseInt(currentStage.slice(-1), 10) - 1]}
          onRating={handleNextStage}
        />
      )}
      {currentStage === 'compareResponses' && <CompareResponses responses={scenarios[currentScenarioIndex].responses} onNext={handleNextStage} />}
      {currentStage === 'endOfScenario' && <EndOfScenario onNext={handleNextStage} />}
      {currentStage === 'thankYou' && <ThankYou onNext={handleNextStage}/>}
      {currentStage == 'end' && <End />}
    </div>
  );
}

export default App;