import React from 'react';
import { countryFlags } from '../utils/flags';

function MatchList({ matches }) {
  return (
    <div>
      {matches.length === 0 ? (
        <p>Brak</p>
      ) : (
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              {match.time} (Grupa {match.group}): {countryFlags[match.team1]} {match.team1} {match.score} {match.team2} {countryFlags[match.team2]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchList;
