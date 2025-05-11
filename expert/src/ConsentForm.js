import React from 'react';
import './App.css';

function ConsentForm({ onConsent }) {
  return (
    <div className="App">
      <div className="App-header">
        <h1>Consent Form</h1>
        <p>
          <p><b>Study Duration and Compensation</b></p> 
          <p>We estimate this study will take approximately 10 minutes to complete. If you are a participant on Mechanical Turk or Prolific, you will be compensated as per the details outlined on those platforms. Compensation will be provided after successful completion and verification of your participation.</p>
          <p><b>Privacy and Confidentiality</b></p>
          <p>No personally identifiable information will be collected. Your responses will be stored securely and used only for research purposes in de-identified, aggregated formats. These results may be included in research publications and presentations.</p>   
          <p><b>Voluntary Participation and Withdrawal</b></p> 
          <p>Participation in this study is voluntary. You may withdraw at any time without penalty. If you wish to withdraw after participation, contact Harsh Kumar (harsh@cs.toronto.edu) before the data is finalized for analysis. For questions about the study, you may contact Ashton Anderson (ashton@cs.toronto.edu). For an independent opinion regarding the research or your rights as a participant, you may contact the University of Toronto Research Oversight and Compliance Office via email (ethics.review@utoronto.ca) or phone (416-946-3273). </p>
          <p>By clicking to continue, you confirm that: You have read and understood the information on this sheet. 
            <ul>
              <li>You are at least 18 years of age.</li>
              <li>You consent to participate and allow your data to be used for the purposes outlined above. </li>
              <li>You understand that you may withdraw at any time without penalty.</li>
            </ul>
            </p>
          </p>
        <form onSubmit={onConsent}>
          <input type="checkbox" required /> I agree to participate in the survey.
          <p></p>
          <button type="submit">Agree and Continue</button>
        </form>
      </div>
    </div>
  );
}

export default ConsentForm;