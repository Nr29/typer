import React, { useEffect, useState } from 'react';
import MatchList from './components/MatchList';
import Predictions from './components/Predictions';
import { fetchData } from './utils/fetchData';
import './App.css';
import PointsTable from './components/PointsTable';

const SPREADSHEET_ID = '10lJ4gpZHfULHBGKl15ObosxqdmxqQfUjoCZAO1BDRy4';
const API_KEY = 'AIzaSyAZw3Ivd7yYzwPERuErJ4JDsiad1CJOwBU';
const RANGE = 'Zbiorczy!A2:BA100';
const RANGE_POINTS = 'Punkty!A1:F20';

const fetchLeaderboard = async (SPREADSHEET_ID, API_KEY, RANGE_POINTS) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE_POINTS}?key=${API_KEY}`);
  const data = await response.json();
  return data.values;
};


function App() {
  const [matches, setMatches] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchData(SPREADSHEET_ID, API_KEY, RANGE, setMatches, setPredictions, setNextMatches);
    fetchLeaderboard(SPREADSHEET_ID, API_KEY, RANGE_POINTS).then(data => setLeaderboard(data));
    console.log('leaderboard:', leaderboard);
  }, []);

  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const todayMatches = matches.filter(match => match.date === today);
  console.log('todayMatches:', todayMatches);
  const tomorrowMatches = matches.filter(match => match.date === tomorrow);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <h1>⚽ EURO 2024 Typer Master Edition ⚽</h1>
      <hr />
      <h3>Dzisiejsze mecze</h3>
      <MatchList matches={todayMatches} />
      <hr />
      <h3>Jutrzejsze mecze</h3>
      <MatchList matches={tomorrowMatches} />
      <hr />
      <h3>Najbliższe mecze</h3>
      {nextMatches.length > 0 ? (
        nextMatches.map((match, index) => (
          <div key={index}>
            {match.date} {match.time} ({match.group}) : {match.team1} {match.score} {match.team2}
          </div>
        ))
        ) : (
          <p>Brak nadchodzących meczów</p>
          )}
      <hr />
      <h2>TYPY</h2>
       {todayMatches.length > 0 && (
         <Predictions predictions={predictions} matches={todayMatches} />
         )}
      <hr />
      <PointsTable points={leaderboard} />
        {/* <button onClick={toggleDarkMode}>{darkMode ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}</button> */}
    </div>
  );
}

export default App;
