import React, { useEffect, useState } from 'react';
import Poll from './components/Poll/Poll';
import { AppProvider } from './contexts/AppContext/AppContext';
import data from './data/a1/Poll';

function App() {
  const [sheetsData, setSheetsData] = useState([]);

  console.log('data', data);

  const getSheets = async () => {
    const response = await fetch('/sheets');
    const responseJson = await response.json();
    setSheetsData(responseJson);
  };

  const updateSheets = async answer => {
    const response = await fetch('/sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer
      })
    });
    const responseJson = await response.json();
    setSheetsData(responseJson);
  };

  useEffect(() => {
    getSheets();
  }, []);

  return (
    <AppProvider
      value={{
        data,
        sheetsData,
        getSheets,
        updateSheets
      }}
    >
      <div className="App">
        <h1>NodeJS/React/Google Sheets API demo</h1>
        <p>
          Using the Carbon React component library. | View data in{' '}
          <a
            href="https://docs.google.com/spreadsheets/d/1gDNRkYGrGBU6IggYcfDJt_jC_hnT97LaHSlXJeoYKWw/edit#gid=2061543366"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Sheets
          </a>
          .
        </p>
        <Poll />
      </div>
    </AppProvider>
  );
}

export default App;
