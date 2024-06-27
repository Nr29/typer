import React, { useEffect, useState } from 'react';
import MatchList from './components/MatchList';
import Predictions from './components/Predictions';
import PointsTable from './components/PointsTable';
import SnakeGame from './components/SnakeGame';
import { fetchData } from './utils/fetchData';
import { fetchAlert } from './utils/fetchAlert';
import { countryFlags} from './utils/flags';
import 'firebase/firestore';
import './components/Leaderboard.css'
import './App.css';

const SPREADSHEET_ID = '10lJ4gpZHfULHBGKl15ObosxqdmxqQfUjoCZAO1BDRy4';
const API_KEY = 'AIzaSyAZw3Ivd7yYzwPERuErJ4JDsiad1CJOwBU';
const RANGE = 'Zbiorczy!A2:BJ100';
const RANGE_POINTS = 'Punkty!A1:F30';
const RANGE_ALERT = 'Wyniki!G1:G1';

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
  const [alert, setAlert] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('typer');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showTyper = () => {
    setCurrentView('typer');
  };

  const showSnake = () => {
    setCurrentView('snake');
  };

  useEffect(() => {
    fetchData(SPREADSHEET_ID, API_KEY, RANGE, setMatches, setPredictions, setNextMatches);
    fetchLeaderboard(SPREADSHEET_ID, API_KEY, RANGE_POINTS).then(data => setLeaderboard(data));
    fetchAlert(SPREADSHEET_ID, API_KEY, RANGE_ALERT).then(data => {
      if (data && data.length > 0 && data[0].length > 0) {
        setAlert(data[0][0]);}});
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const todayMatches = matches.filter(match => match.date === today);
  /* console.log('todayMatches:', todayMatches); */
  const tomorrowMatches = matches.filter(match => match.date === tomorrow);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <h1>
      <button onClick={showTyper}>⚽</button>
      EURO 2024 Typer Master Edition
      <button onClick={showSnake}>🐍</button>
      </h1>
    
      {currentView === 'typer' && (
        <>
          <hr></hr>
          {alert && (
            <div className="alert">
              <h2>
                <strong>{alert}</strong>
                </h2>
            </div>
          )}
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
                {match.date} {match.time}: {countryFlags [match.team1]} {match.team1} {match.score} {match.team2} {countryFlags [match.team2]}
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
        </>
      )}
      {currentView === 'snake' && <SnakeGame />}
    </div>
  );
}

export default App;
