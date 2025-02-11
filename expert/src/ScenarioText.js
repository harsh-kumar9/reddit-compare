import React, { useState, useEffect } from 'react';

function ScenarioText({ title, text, onNext }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsButtonDisabled(false);
        }, 60); // 60 seconds delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            <div className="App-header">
                <h2>Please carefully read the following post from a user seeking advice on a social media forum.</h2>
                <div className="response-box">
                    <div><span className="fa fa-user-circle"></span> Anonymous Poster</div>
                    <h3>{title}</h3>
                    <p>
                        {text.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
                <button onClick={onNext} disabled={isButtonDisabled}>
                    {isButtonDisabled ? 'Please wait...' : 'Next'}
                </button>
            </div>
        </div>
    );
}

export default ScenarioText;
