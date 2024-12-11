import React, { useState } from 'react';
import Instructions from './Instructions';
import ConsentForm from './ConsentForm';
import ProfessionalExperience from './ProfessionalExperience';
import ScenarioIntro from './ScenarioIntro';
import ScenarioText from './ScenarioText';
import ResponseRating from './ResponseRating';
import CompareResponses from './CompareResponses';
import EndOfScenario from './EndOfScenario';
import ThankYou from './ThankYou';

function App() {
  const [currentStage, setCurrentStage] = useState('instructions');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([
    // Placeholder data; replace with actual data fetch
    {
      text: "Scenario 1 Text...",
      responses: ["Response 1-1", "Response 1-2", "Response 1-3"]
    },
    {
      text: "Scenario 2 Text...",
      responses: ["Response 2-1", "Response 2-2", "Response 2-3"]
    },
    {
      text: "Scenario 3 Text...",
      responses: ["Response 3-1", "Response 3-2", "Response 3-3"]
    }
  ]);
  const [userInputs, setUserInputs] = useState([]);

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
      {currentStage === 'scenarioText' && <ScenarioText text={scenarios[currentScenarioIndex].text} onNext={handleNextStage} />}
      {['responseRating1', 'responseRating2', 'responseRating3'].includes(currentStage) && (
        <ResponseRating
          response={scenarios[currentScenarioIndex].responses[parseInt(currentStage.slice(-1), 10) - 1]}
          onRating={handleNextStage}
        />
      )}
      {currentStage === 'compareResponses' && <CompareResponses responses={scenarios[currentScenarioIndex].responses} onNext={handleNextStage} />}
      {currentStage === 'endOfScenario' && <EndOfScenario onNext={handleNextStage} />}
      {currentStage === 'thankYou' && <ThankYou />}
    </div>
  );
}

export default App;