import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, PowerUp, Difficulty, HighScore, GameStats } from '../types';
import { GAME_SETTINGS, POWER_UPS } from '../constants';

export const useGameLogic = (playerName: string) => {
  const initialGameState = useMemo<GameState>(() => ({
    score: 0,
    timeLeft: GAME_SETTINGS.BASE_DURATION,
    streak: 0,
    activePowerUp: null,
    difficulty: 'normal'
  }), []);

  const initialGameStats = useMemo<GameStats>(() => ({
    totalGames: 0,
    totalScore: 0,
    bestScore: 0,
    longestStreak: 0
  }), []);

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeMole, setActiveMole] = useState<number>(-1);
  const [hitState, setHitState] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>(initialGameStats);

  const moleInterval = useRef<number>();
  const powerUpTimeout = useRef<number>();

  // Load persisted data on mount
  useEffect(() => {
    const savedScores = localStorage.getItem('highScores');
    if (savedScores) {
      try {
        const parsed = JSON.parse(savedScores);
        setHighScores(parsed);
      } catch (e) {
        console.error('Failed to parse highScores:', e);
        setHighScores([]);
      }
    }

    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setGameStats(parsed);
      } catch (e) {
        console.error('Failed to parse gameStats:', e);
        setGameStats(initialGameStats);
      }
    }
  }, [initialGameStats]);

  const updateHighScores = useCallback((score: number) => {
    setHighScores((prev: HighScore[]) => {
      const newScores = [...prev, { 
        name: playerName, 
        score, 
        date: new Date().toISOString() 
      }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10 scores
      
      localStorage.setItem('highScores', JSON.stringify(newScores));
      return newScores;
    });
  }, [playerName]);

  const updateStats = useCallback((finalScore: number, finalStreak: number) => {
    setGameStats((prev: GameStats) => {
      const newStats = {
        totalGames: prev.totalGames + 1,
        totalScore: prev.totalScore + finalScore,
        bestScore: Math.max(prev.bestScore, finalScore),
        longestStreak: Math.max(prev.longestStreak, finalStreak)
      };
      localStorage.setItem('gameStats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const activatePowerUp = useCallback((type: PowerUp['type']) => {
    const powerUp = POWER_UPS[type];
    setGameState((prev: GameState) => ({
      ...prev,
      activePowerUp: {
        type,
        duration: powerUp.duration,
        active: true
      }
    }));

    if (type === 'extraTime') {
      setGameState((prev: GameState) => ({
        ...prev,
        timeLeft: prev.timeLeft + 5
      }));
    } else {
      powerUpTimeout.current = window.setTimeout(() => {
        setGameState((prev: GameState) => ({
          ...prev,
          activePowerUp: null
        }));
      }, powerUp.duration);
    }
  }, []);

  const handleMoleHit = useCallback((index: number) => {
    if (index !== activeMole || !isPlaying) return;

    const difficultySettings = GAME_SETTINGS.DIFFICULTY_SETTINGS[gameState.difficulty];
    let points = difficultySettings.points;
    
    if (gameState.activePowerUp?.type === 'doublePoints') {
      points *= 2;
    }

    setGameState((prev: GameState) => ({
      ...prev,
      score: prev.score + points,
      streak: prev.streak + 1
    }));

    setHitState(true);
    setActiveMole(-1);

    // Random powerup chance
    if (Math.random() < GAME_SETTINGS.POWERUP_CHANCE) {
      const powerUpTypes = Object.keys(POWER_UPS) as PowerUp['type'][];
      const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      activatePowerUp(randomPowerUp);
    }

    setTimeout(() => {
      setHitState(false);
    }, GAME_SETTINGS.HIT_DISPLAY_DURATION);
  }, [activeMole, isPlaying, gameState.difficulty, gameState.activePowerUp, activatePowerUp]);

  const startGame = useCallback((difficulty: Difficulty) => {
    setIsPlaying(true);
    setGameState({
      ...initialGameState,
      difficulty
    });
  }, [initialGameState]);

  useEffect(() => {
    if (!isPlaying) return;

    const difficultySettings = GAME_SETTINGS.DIFFICULTY_SETTINGS[gameState.difficulty];
    const speed = gameState.activePowerUp?.type === 'slowMotion' 
      ? difficultySettings.moleSpeed * 1.5 
      : difficultySettings.moleSpeed;

    moleInterval.current = window.setInterval(() => {
      setActiveMole(Math.floor(Math.random() * GAME_SETTINGS.MOLE_COUNT));
    }, speed);

    const timer = setInterval(() => {
      setGameState((prev: GameState) => {
        if (prev.timeLeft <= 1) {
          setIsPlaying(false);
          updateStats(prev.score, prev.streak);
          updateHighScores(prev.score);
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      clearInterval(moleInterval.current);
      clearInterval(timer);
      clearTimeout(powerUpTimeout.current);
    };
  }, [isPlaying, gameState.difficulty, gameState.activePowerUp, updateStats, updateHighScores]);

  return {
    gameState,
    isPlaying,
    activeMole,
    hitState,
    highScores,
    gameStats,
    handleMoleHit,
    startGame
  };
};