import React, { useState, useContext, useEffect } from 'react';
import Questions from './Questions';
import Answers from './Answers';
import AppContext from '../../contexts/AppContext/AppContext';

function Poll(props) {
  const appContext = useContext(AppContext);
  const [section, setSection] = useState('questions');
  const [title, setTitle] = useState(null);
  const data = appContext.data.polls[0];

  console.log('matt!!', appContext.data.question);

  console.log('*** title', title);

  const getTitle = async () => {
    const response = await fetch('/title');
    const responseJson = await response.json();
    setTitle(responseJson);
  };

  useEffect(() => {
    getTitle();
  }, []);

  const onAnswer = async value => {
    await appContext.updateSheets(value);
    setSection('answers');
  };

  return (
    <div className="poll-wrapper">
      <h2>{title}</h2>
      <h2>{data.question}</h2>
      {section === 'questions' && <Questions onAnswer={onAnswer} />}
      {section === 'answers' && (
        <Answers onEdit={() => setSection('questions')} />
      )}
    </div>
  );
}

export default Poll;
