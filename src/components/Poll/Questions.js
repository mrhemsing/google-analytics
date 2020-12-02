import React, { useContext, useState } from 'react';
import AppContext from '../../contexts/AppContext/AppContext';
import { RadioButtonGroup, RadioButton, Button } from 'carbon-components-react';

function Questions(props) {
  const appContext = useContext(AppContext);

  const [answer, setAnswer] = useState(null);
  const data = appContext.data.polls[0];

  return (
    <div className="radio-group-poll">
      <RadioButtonGroup
        defaultSelected={answer}
        labelPosition="right"
        name="poll-example"
        orientation="vertical"
      >
        <RadioButton
          id="poll-answer-1"
          labelText={data.answerSet[0]}
          value={data.answerSet[0]}
          onClick={e => setAnswer(e.target.value)}
        />
        <RadioButton
          id="poll-answer-2"
          labelText={data.answerSet[1]}
          value={data.answerSet[1]}
          onClick={e => setAnswer(e.target.value)}
        />
        <RadioButton
          id="poll-answer-3"
          labelText={data.answerSet[2]}
          value={data.answerSet[2]}
          onClick={e => setAnswer(e.target.value)}
        />
      </RadioButtonGroup>
      <Button onClick={e => props.onAnswer(answer)}>Submit</Button>
      <p>You answered: {answer}</p>
    </div>
  );
}

export default Questions;
