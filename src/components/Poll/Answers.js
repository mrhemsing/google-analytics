import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'carbon-components-react';
import AppContext from '../../contexts/AppContext/AppContext';

function Questions(props) {
  const appContext = useContext(AppContext);
  const [totalVotes, setTotalVotes] = useState(null);

  useEffect(() => {
    setTotalVotes(
      appContext.sheetsData.reduce(
        (total, answer) => total + Number.parseInt(answer[3]),
        0
      )
    );
  }, [appContext.data, appContext.sheetsData]);

  return (
    <div className="graph">
      {appContext.sheetsData.map((vote, index) => {
        const value = vote[2];
        const votes = vote[3];
        const votePercentage = Math.round((votes / totalVotes) * 100);

        return (
          <div key={index} className="poll-wrapper">
            <div className="answer-text">{value}</div>
            <div className="bar-wrapper">
              <div
                className="bar"
                style={{
                  width: `${votePercentage}%`
                }}
              ></div>
            </div>
            <div className="answer-score">
              {votePercentage}%<span>{votes} votes</span>
            </div>
          </div>
        );
      })}
      <div className="total-votes">Total votes: {totalVotes}</div>

      <Button onClick={props.onEdit}>Redo Poll</Button>
    </div>
  );
}

export default Questions;
