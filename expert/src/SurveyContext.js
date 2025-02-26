import { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export const useSurvey = () => useContext(SurveyContext);

export const SurveyProvider = ({ children }) => {
  const [surveyData, setSurveyData] = useState({});

  const updateSurveyData = (newData) => {
    setSurveyData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <SurveyContext.Provider value={{ surveyData, updateSurveyData }}>
      {children}
    </SurveyContext.Provider>
  );
};
