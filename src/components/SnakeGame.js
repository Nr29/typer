import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './SnakeGame.css';
import snakeBodyImage from '../assets/snakebody.png';
import snakeHeadImage from '../assets/snakehead.png';
import snakeHeadOpenImage from '../assets/snakeheadopen.png';
import foodImage from '../assets/food.png';
import snakeTailImage from '../assets/snaketail.png';
import turnImage from '../assets/turn.png';
import Leaderboard from './Leaderboard';

const cellSize = 16;
const width = 336;
const height = 192;

const getRandomFoodPosition = (snake, foodCount) => {
  let newFoodPosition;
  let isOnSnake;

  do {
    isOnSnake = false;

    if (foodCount < 20) {
      const head = snake[0];
      const range = 10;
      newFoodPosition = {
        x: (head.x + Math.floor(Math.random() * range) - range / 2 + width / cellSize) % (width / cellSize),
        y: (head.y + Math.floor(Math.random() * range) - range / 2 + height / cellSize) % (height / cellSize),
      };
    } else {
      newFoodPosition = {
        x: Math.floor(Math.random() * (width / cellSize)),
        y: Math.floor(Math.random() * (height / cellSize)),
      };
    }

    for (let segment of snake) {
      if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
        isOnSnake = true;
        break;
      }
    }
  } while (isOnSnake);

  return newFoodPosition;
};

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const snakeBodyRef = useRef(null);
  const snakeHeadRef = useRef(null);
  const snakeHeadOpenRef = useRef(null);
  const snakeTailRef = useRef(null);
  const foodRef = useRef(null);
  const turnRef = useRef(null);

  const [snake, setSnake] = useState([{ x: 10, y: 10, dir: 'RIGHT' }]);
  const [food, setFood] = useState(getRandomFoodPosition([{ x: 10, y: 10, dir: 'RIGHT' }], 0, width, height, cellSize));
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [foodCount, setFoodCount] = useState(0);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [highScoreSaved, setHighScoreSaved] = useState(false);
  const [directionQueue, setDirectionQueue] = useState([]); // Kolejka kierunków
  const speed = 150;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        moveSnake();
      }
    }, speed);

    const handleKeyDown = (e) => {
      changeDirection(e);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, gameOver, directionQueue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const snakeBody = new Image();
    snakeBody.src = snakeBodyImage;
    snakeBody.onload = () => {
      snakeBodyRef.current = snakeBody;
      drawGame(ctx);
    };

    const snakeHead = new Image();
    snakeHead.src = snakeHeadImage;
    snakeHead.onload = () => {
      snakeHeadRef.current = snakeHead;
      drawGame(ctx);
    };

    const snakeHeadOpen = new Image();
    snakeHeadOpen.src = snakeHeadOpenImage;
    snakeHeadOpen.onload = () => {
      snakeHeadOpenRef.current = snakeHeadOpen;
      drawGame(ctx);
    };

    const snakeTail = new Image();
    snakeTail.src = snakeTailImage;
    snakeTail.onload = () => {
      snakeTailRef.current = snakeTail;
      drawGame(ctx);
    };

    const food = new Image();
    food.src = foodImage;
    food.onload = () => {
      foodRef.current = food;
      drawGame(ctx);
    };

    const turn = new Image();
    turn.src = turnImage;
    turn.onload = () => {
      turnRef.current = turn;
      drawGame(ctx);
    };

    drawGame(ctx);
  }, [snake, food, isMouthOpen]);

  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, width, height);

    snake.forEach((segment, index) => {
      const segmentDirection = getSegmentDirection(index);
      let segmentImage;

      if (index === 0 && snakeHeadRef.current) {
        segmentImage = isMouthOpen ? snakeHeadOpenRef.current : snakeHeadRef.current;
      } else if (index === snake.length - 1 && snakeTailRef.current) {
        segmentImage = snakeTailRef.current;
      } else if (index > 0 && index < snake.length - 1) {
        const prevSegment = snake[index - 1];
        const nextSegment = snake[index + 1];
        if (isTurnSegment(prevSegment, segment, nextSegment)) {
          segmentImage = turnRef.current;
          drawTurnImage(ctx, segmentImage, segment.x * cellSize, segment.y * cellSize, prevSegment, segment, nextSegment);
        } else {
          segmentImage = snakeBodyRef.current;
          drawRotatedImage(ctx, { image: segmentImage, rotation: 0 }, segment.x * cellSize, segment.y * cellSize, segmentDirection);
        }
      } else {
        segmentImage = snakeBodyRef.current;
      }

      if (segmentImage && segmentImage !== turnRef.current) {
        drawRotatedImage(ctx, { image: segmentImage, rotation: 0 }, segment.x * cellSize, segment.y * cellSize, segmentDirection);
      }
    });

    if (foodRef.current) {
      ctx.drawImage(foodRef.current, food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    }
  };

  const isTurnSegment = (prevSegment, currentSegment, nextSegment) => {
    return (
      (prevSegment.x !== nextSegment.x && prevSegment.y !== nextSegment.y) ||
      (currentSegment.x !== nextSegment.x && currentSegment.y !== nextSegment.y)
    );
  };

  const drawRotatedImage = (ctx, imageObj, x, y, direction) => {
    const { image, rotation } = imageObj;
    if (!image) {
      console.error("Image not loaded:", imageObj);
      return;
    }
    ctx.save();
    ctx.translate(x + cellSize / 2, y + cellSize / 2);
    switch (direction) {
      case 'UP':
        ctx.rotate((Math.PI / 180) * (270 + rotation));
        ctx.scale(1, 1);
        break;
      case 'DOWN':
        ctx.rotate((Math.PI / 180) * (90 + rotation));
        ctx.scale(1, -1);
        break;
      case 'LEFT':
        ctx.scale(-1, 1);
        break;
      case 'RIGHT':
        ctx.scale(1, 1);
        break;
      default:
        break;
    }
    ctx.drawImage(image, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
    ctx.restore();
  };

  const drawTurnImage = (ctx, image, x, y, prevSegment, currentSegment, nextSegment) => {
    ctx.save();
    ctx.translate(x + cellSize / 2, y + cellSize / 2);
    const dx = currentSegment.x - prevSegment.x;
    const dy = currentSegment.y - prevSegment.y;
    const nextDx = nextSegment.x - currentSegment.x;
    const nextDy = nextSegment.y - currentSegment.y;

    if (dx === 1 && nextDy === 1) {
      ctx.scale(-1, 1);
    } else if (dx === -1 && nextDy === -1) {
      ctx.scale(1, -1);
    } else if (dx === 1 && nextDy === -1) {
      ctx.scale(-1, -1);
    } else if (dx === -1 && nextDy === 1) {
      ctx.scale(1, 1);
    } else if (dy === 1 && nextDx === -1) {
      ctx.scale(-1, -1);
    } else if (dy === -1 && nextDx === 1) {
      ctx.scale(1, 1);
    } else if (dy === 1 && nextDx === 1) {
      ctx.scale(1, -1);
    } else if (dy === -1 && nextDx === -1) {
      ctx.scale(-1, 1);
    }

    ctx.drawImage(image, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
    ctx.restore();
  };

  const getSegmentDirection = (index) => {
    if (index === 0) return direction;

    const nextSegment = snake[index - 1];
    const currentSegment = snake[index];

    if (nextSegment.x > currentSegment.x) return 'RIGHT';
    if (nextSegment.x < currentSegment.x) return 'LEFT';
    if (nextSegment.y > currentSegment.y) return 'DOWN';
    if (nextSegment.y < currentSegment.y) return 'UP';
  };

  const changeDirection = (event) => {
    const { key } = event;
    let newDirection = direction;
    if (key === 'ArrowUp' || key === 'w') {
      if (direction !== 'DOWN') newDirection = 'UP';
    } else if (key === 'ArrowDown' || key === 's') {
      if (direction !== 'UP') newDirection = 'DOWN';
    } else if (key === 'ArrowLeft' || key === 'a') {
      if (direction !== 'RIGHT') newDirection = 'LEFT';
    } else if (key === 'ArrowRight' || key === 'd') {
      if (direction !== 'LEFT') newDirection = 'RIGHT';
    }

    if (!isOppositeDirection(newDirection, direction)) {
      setDirection(newDirection);
      setDirectionQueue((prevQueue) => [...prevQueue, newDirection]);
    }
  };

  const handleButtonClick = (newDirection) => {
    if (!isOppositeDirection(newDirection, direction)) {
      setDirection(newDirection);
      setDirectionQueue((prevQueue) => [...prevQueue, newDirection]);
    }
  };

  const isOppositeDirection = (newDirection, currentDirection) => {
    return (
      (newDirection === 'UP' && currentDirection === 'DOWN') ||
      (newDirection === 'DOWN' && currentDirection === 'UP') ||
      (newDirection === 'LEFT' && currentDirection === 'RIGHT') ||
      (newDirection === 'RIGHT' && currentDirection === 'LEFT')
    );
  };

  const moveSnake = () => {
    let newDirection = direction;
    if (directionQueue.length > 0) {
      newDirection = directionQueue[0];
      setDirectionQueue((prevQueue) => prevQueue.slice(1));
    }

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (newDirection) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }
    head.dir = newDirection;

    if (head.x < 0) {
      head.x = width / cellSize - 1;
    } else if (head.x >= width / cellSize) {
      head.x = 0;
    } else if (head.y < 0) {
      head.y = height / cellSize - 1;
    } else if (head.y >= height / cellSize) {
      head.y = 0;
    }

    newSnake.unshift(head);

    const isNearFood =
      (Math.abs(head.x - food.x) === 1 && head.y === food.y) ||
      (Math.abs(head.y - food.y) === 1 && head.x === food.x);

    if (isNearFood) {
      setIsMouthOpen(true);
    } else {
      setIsMouthOpen(false);
    }

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomFoodPosition(newSnake, foodCount + 1, width, height, cellSize));
      setFoodCount(foodCount + 1);
    } else {
      newSnake.pop();
    }

    if (checkCollision(head, newSnake)) {
      setGameOver(true);
      promptForNickAndSaveScore(foodCount * 100);
    } else {
      setSnake(newSnake);
    }
  };

  const checkCollision = (head, snake) => {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  const promptForNickAndSaveScore = (points) => {
    const userNick = prompt(`Koniec gry! Twój wynik to: ${points}. Wpisz ksywke:`, "Typer");
    saveHighScore(userNick || "Typer", points);
  };

  const saveHighScore = async (nick, points) => {
    try {
      const docRef = await addDoc(collection(db, 'highscores'), {
        nick: nick,
        points: points,
        timestamp: new Date(),
      });
      setHighScoreSaved(true);
      console.log('High score saved successfully:', docRef.id);
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10, dir: 'RIGHT' }];
    setSnake(initialSnake);
    setFood(getRandomFoodPosition(initialSnake, 0, width, height, cellSize));
    setDirection('RIGHT');
    setGameOver(false);
    setFoodCount(0);
    setHighScoreSaved(false);
    setDirectionQueue([]); // Resetowanie kolejki kierunków
  };

  return (
    <div className="snake-game-container">
      <button onClick={resetGame} className="restart-button">Restart</button>
      <h1 className="score">Score: {foodCount * 100}</h1>
      <canvas ref={canvasRef} width={width} height={height} className="canvas" />
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="control-buttons">
        <button onClick={() => handleButtonClick('UP')}>UP</button>
        <div>
          <button onClick={() => handleButtonClick('LEFT')}>LEFT</button>
          <button onClick={() => handleButtonClick('RIGHT')}>RIGHT</button>
        </div>
        <button onClick={() => handleButtonClick('DOWN')}>DOWN</button>
      </div>
      <Leaderboard />
    </div>
  );
};

export default SnakeGame;
