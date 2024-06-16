// src/components/Leaderboard.js
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Leaderboard.css';

const Leaderboard = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const q = query(collection(db, 'highscores'), orderBy('points', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const scores = querySnapshot.docs.map(doc => doc.data());
        console.log('Fetched high scores:', scores);
        setHighScores(scores);
      } catch (error) {
        console.error('Error fetching high scores:', error);
      }
    };

    fetchHighScores();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return '🏆'; // Gold trophy
    if (index === 1) return '🥈'; // Silver medal
    if (index === 2) return '🥉'; // Bronze medal
    return '';
  };

  return (
    <div className="leaderboard-container">
      <h2>Wyniki</h2>
      <ol>
        {highScores.map((score, index) => (
          <li key={index}>
            <span className="rank">{getMedal(index)} {index + 1}.</span>
            <span className="name">{score.nick}</span>
            <span className="score">{score.points}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
