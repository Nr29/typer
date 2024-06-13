import React from 'react';

function Predictions({ predictions, matches }) {
  // Pobierz listę użytkowników z predykcji
  const users = [...new Set(predictions.map(prediction => prediction.user))];

  // Funkcja do identyfikacji identycznych predykcji
  const findIdenticalPredictions = (predictions, matchRowIndex) => {
    const counts = {};
    predictions.forEach(prediction => {
      const key = `${prediction.team1Prediction}-${prediction.team2Prediction}-${prediction.points}`;
      if (!counts[key]) {
        counts[key] = { count: 0, emoji: null };
      }
      counts[key].count++;
    });

    const emojis = ['⭐', '🎯', '🔥', '💥', '💫', '✨', '🌟', '🌈', '🍀', '💎', '⚡', '🔄'];
    let emojiIndex = 0;

    Object.keys(counts).forEach(key => {
      if (counts[key].count > 1) {
        counts[key].emoji = emojis[emojiIndex];
        emojiIndex = (emojiIndex + 1) % emojis.length;
      }
    });

    return counts;
  };

  return (
    <div>
      <div>
        {matches.map((match, matchIndex) => (
          <div key={matchIndex} style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {match.team1} {match.score} {match.team2}
          </div>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            {users.map((user, userIndex) => (
              <th key={userIndex}>{user}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((match, matchIndex) => {
            const identicalPredictions = findIdenticalPredictions(
              predictions.filter(prediction => prediction.rowIndex === match.rowIndex),
              match.rowIndex
            );
            return (
              <tr key={matchIndex}>
                {users.map((user, userIndex) => {
                  const prediction = predictions.find(
                    pred => pred.rowIndex === match.rowIndex && pred.user === user
                  );
                  const points = prediction ? prediction.points : null;
                  const key = prediction
                    ? `${prediction.team1Prediction}-${prediction.team2Prediction}-${prediction.points}`
                    : '';
                  const emoji = identicalPredictions[key]
                    ? identicalPredictions[key].emoji
                    : null;
                  let cellClass = '';
                  if (points === '0') cellClass = 'red-cell';
                  if (points === '1') cellClass = 'yellow-cell';
                  if (points === '3') cellClass = 'green-cell';
                  return (
                    <td key={userIndex} className={cellClass}>
                      {prediction ? (
                        <>
                          {`${prediction.team1Prediction} - ${prediction.team2Prediction}`}
                          {` (${points})`}
                          {emoji && <span role="img" aria-label="identical"> {emoji}</span>}
                        </>
                      ) : (
                        ''
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Predictions;
