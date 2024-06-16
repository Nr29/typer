import React, { useState, useEffect } from 'react';
import SnakeGame from './SnakeGame';

const SnakeGameWithControls = () => {
  const [direction, setDirection] = useState('RIGHT');

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  const handleDirectionChange = (newDirection) => {
    if (
      (newDirection === 'UP' && direction !== 'DOWN') ||
      (newDirection === 'DOWN' && direction !== 'UP') ||
      (newDirection === 'LEFT' && direction !== 'RIGHT') ||
      (newDirection === 'RIGHT' && direction !== 'LEFT')
    ) {
      setDirection(newDirection);
    }
  };

  return (
    <div>
      <SnakeGame direction={direction} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={() => handleDirectionChange('UP')}>Up</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button onClick={() => handleDirectionChange('LEFT')}>Left</button>
        <button onClick={() => handleDirectionChange('DOWN')}>Down</button>
        <button onClick={() => handleDirectionChange('RIGHT')}>Right</button>
      </div>
    </div>
  );
};

export default SnakeGameWithControls;
