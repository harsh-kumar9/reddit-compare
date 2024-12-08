import React, { useState } from 'react';

function AdviceInput({ onSubmit }) {
    const [advice, setAdvice] = useState('');

    // Correct the form submission to prevent default form behavior
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(advice);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Enter Your Advice</h2> {/* Title added here */}
            <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Type your advice here..."
                style={{ width: '100%', height: '150px', marginBottom: '10px' }} // Styling for better UX
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default AdviceInput;