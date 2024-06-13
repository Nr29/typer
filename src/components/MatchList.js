import React from 'react';

function MatchList({ matches }) {
  console.log('MatchList received matches:', matches);
  return (
    <div>
      {matches.length === 0 ? (
        <p>Brak</p>
      ) : (
        <ul>
          {matches.map((match, index) => (
            <ul key={index}>
              {match.time} (Grupa {match.group}): {match.team1} {match.score} {match.team2}
            </ul>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchList;
