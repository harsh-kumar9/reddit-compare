import React from 'react';

function ConsentForm({ onConsent }) {
  return (
    <div>
      <h1>Consent Form</h1>
      <p>Please consent to participate in the survey.</p>
      <form onSubmit={onConsent}>
        <input type="checkbox" required /> I agree to participate in the survey.
        <button type="submit">Agree and Continue</button>
      </form>
    </div>
  );
}

export default ConsentForm;