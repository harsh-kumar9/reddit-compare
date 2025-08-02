import React from 'react';
import cheat from './img/cheat.png'; // Ensure this image file is present (see notes below)
import './App.css';

function Instructions({ checked, handleCheck, onNext }) {
  return (
    <div className="App">
      <div className="App-header">

        <h1 className='text-4xl font-bold mb-4 text-center'>
          Help Us Advance Advice-Giving Technology!
        </h1>
                <p className='text-2xl mb-2 text-center'>
          <span>
            <b>Your expert guidance will help us design advice-giving technology that can benefit countless others in need. Your participation is essential for making advice and motivation accessible to everyone—thank you!</b>
          </span>
        </p>
        <hr style={{ marginTop: '20px', marginBottom: '20px' }} />

        <p className='text-2xl mb-4 text-center'>
          <span className='text-red-700 font-bold'>
            <b><u>IMPORTANT</u>:</b> Please <b>do not take screenshots, copy any text, or consult external tools</b> (e.g., ChatGPT).
          </span>{" "}
          We're just interested in your best effort and what you learn.
          <br /> <br/>
        The experiment will be <b>ruined</b> if you take screenshots or use external tools to do this task. So please do not do so! <b>In fact, you have no reason to do so because you are not paid based on performance</b>.
        </p>

        <p className='text-2xl text-red-700 font-bold mb-8 text-center'>
          Please do not refresh the page. Refreshing will lose any progress you have made, and you may not receive any compensation.
        </p>

        <div>
          <img
            src={cheat}
            alt="No screenshots or external tools allowed"
            style={{ maxWidth: "40%", height: "auto", display: "block", margin: "0px auto" }}
          />
        </div>

        <hr style={{ marginTop: '20px', marginBottom: '20px' }} />

        <p className='text-xl text-center mb-4'>
          In this study, you will assess comments that people provide in response to real-life situations where individuals share their personal goals or challenges. You'll help us better understand what makes advice supportive, motivating, and effective.
        </p>

        <ol className='text-lg mb-4'>
          <li>Read multiple posts where people describe their goals or difficulties.</li>
          <li>Carefully evaluate a series of comments posted in reply, rating each for helpfulness, relevance, and tone.</li>
          <li>Rank the comments in order of overall effectiveness.</li>
        </ol>

        <label className="text-2xl mt-2 flex items-center justify-center">
          <input type="checkbox" checked={checked} onChange={handleCheck} />
          <span>
            <b>{`  `}I promise not to take screenshots, pictures, or use external tools to do this study. I understand that I will not be paid more if I do so and it will only ruin the experiment</b>
          </span>
        </label>
        <br></br>
         <br></br>

        <button className='mt-8 text-2xl' onClick={onNext}>
          Start Survey
        </button>
      </div>
    </div>
  );
}

export default Instructions;
