import React, { useState, useEffect } from 'react';
import Instructions from './Instructions';
import ConsentForm from './ConsentForm';
import ScenarioIntro from './ScenarioIntro';
import ScenarioText from './ScenarioText';
import AdviceInput from './AdviceInput';
import ResponseRating from './ResponseRating';
import CompareResponses from './CompareResponses';
import EndOfScenario from './EndOfScenario';
import ThankYou from './ThankYou';
import inputData from './data/input.json';

function App() {

  const getRandomScenarios = (data, count) => {
    // Filter out posts that have been selected 3 times
    const availablePosts = data.posts.filter(post => post.selectedCount < 3);
    
    if (availablePosts.length < count) {
      console.warn("Not enough posts left to select the required scenarios.");
      return availablePosts.map(post => ({
        text: post.body,
        responses: [
          post.comments.best_comment,
          post.comments.percentile_10_comment,
          post.comments.gpt_comment,
          post.comments.claude_comment
        ]
      }));
    }
    
    // Randomly shuffle and select the desired count
    const shuffled = [...availablePosts].sort(() => 0.5 - Math.random());
    const selectedScenarios = shuffled.slice(0, count);
  
    // Increment the selectedCount for chosen posts
    selectedScenarios.forEach(post => {
      const originalPost = data.posts.find(p => p.id === post.id);
      originalPost.selectedCount += 1;
    });
  
    // Return the formatted scenarios
    return selectedScenarios.map(post => ({
      text: post.body,
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
        setCurrentStage('scenarioIntro');
        break;
      case 'scenarioIntro':
        setCurrentStage('scenarioText');
        break;
      case 'scenarioText':
        setCurrentStage('adviceInput');
        break;
      case 'adviceInput':
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
        setCurrentStage('compareResponses');  // Proceed to comparison after 4th rating
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
        setCurrentStage('instructions');
    }
  };

  return (
    <div>
      {currentStage === 'instructions' && <Instructions onNext={handleNextStage} />}
      {currentStage === 'consent' && <ConsentForm onConsent={handleNextStage} />}
      {currentStage === 'scenarioIntro' && <ScenarioIntro onNext={handleNextStage} scenarioNumber={currentScenarioIndex + 1} />}
      {currentStage === 'scenarioText' && <ScenarioText text={scenarios[currentScenarioIndex].text} onNext={handleNextStage} />}
      {currentStage === 'adviceInput' && <AdviceInput onSubmit={handleNextStage} />}
      {['responseRating1', 'responseRating2', 'responseRating3', 'responseRating4'].includes(currentStage) && scenarios.length > 0 && (
        <ResponseRating
          response={scenarios[currentScenarioIndex].responses[parseInt(currentStage.slice(-1), 10) - 1]}
          onRating={handleNextStage}
        />
      )}
      {currentStage === 'compareResponses' && <CompareResponses responses={scenarios[currentScenarioIndex].responses} onSelect={handleNextStage} />}
      {currentStage === 'endOfScenario' && <EndOfScenario onNext={handleNextStage} />}
      {currentStage === 'thankYou' && <ThankYou />}
    </div>
  );
}

export default App;