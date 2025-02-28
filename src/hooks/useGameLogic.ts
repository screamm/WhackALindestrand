// /src/hooks/useGameLogic.ts

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
  const [hitMole, setHitMole] = useState<number>(-1); // Spårar vilken mole som träffades
  const [hitState, setHitState] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>(initialGameStats);

  // Refs för att hantera timers
  const moleInterval = useRef<number | null>(null);
  const powerUpTimeout = useRef<number | null>(null);
  const hitTimeout = useRef<number | null>(null);

  // Ladda highscores och statistik
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

  // Uppdatera highscores
  const updateHighScores = useCallback((score: number) => {
    setHighScores((prev: HighScore[]) => {
      const newScores = [...prev, { 
        name: playerName, 
        score, 
        date: new Date().toISOString() 
      }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Behåll bara de 10 bästa
      
      localStorage.setItem('highScores', JSON.stringify(newScores));
      return newScores;
    });
  }, [playerName]);

  // Uppdatera statistik
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

  // Aktivera powerup
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
      if (powerUpTimeout.current) {
        clearTimeout(powerUpTimeout.current);
      }
      
      powerUpTimeout.current = window.setTimeout(() => {
        setGameState((prev: GameState) => ({
          ...prev,
          activePowerUp: null
        }));
      }, powerUp.duration);
    }
  }, []);

  // Hantera träff
  const handleMoleHit = useCallback((index: number) => {
    if (index !== activeMole || !isPlaying) return;

    // Beräkna poäng
    const difficultySettings = GAME_SETTINGS.DIFFICULTY_SETTINGS[gameState.difficulty];
    let points = difficultySettings.points;
    
    if (gameState.activePowerUp?.type === 'doublePoints') {
      points *= 2;
    }

    // Uppdatera poäng och streak
    setGameState((prev: GameState) => ({
      ...prev,
      score: prev.score + points,
      streak: prev.streak + 1
    }));

    // Sätt hitState och hitMole
    setHitState(true);
    setHitMole(index);
    
    // Gör den nuvarande mole-positionen inaktiv omedelbart men behåll hitMole
    setActiveMole(-1);
    
    // Rensa eventuell tidigare hit timeout
    if (hitTimeout.current) {
      clearTimeout(hitTimeout.current);
    }
    
    // Schemalägg återställning av hit state
    hitTimeout.current = window.setTimeout(() => {
      setHitState(false);
      setHitMole(-1);
    }, 500); // Visa träffbilden i 2 sekunder

    // Chans för powerup
    if (Math.random() < GAME_SETTINGS.POWERUP_CHANCE) {
      const powerUpTypes = Object.keys(POWER_UPS) as PowerUp['type'][];
      const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      activatePowerUp(randomPowerUp);
    }
  }, [activeMole, isPlaying, gameState.difficulty, gameState.activePowerUp, activatePowerUp]);

  // Starta spel
  const startGame = useCallback((difficulty: Difficulty) => {
    setIsPlaying(true);
    setGameState({
      ...initialGameState,
      difficulty
    });
    
    // Återställ states
    setActiveMole(-1);
    setHitMole(-1);
    setHitState(false);
  }, [initialGameState]);

  // Hantera mole-aktivering och timers
  useEffect(() => {
    if (!isPlaying) return;

    // Beräkna hastighet
    const difficultySettings = GAME_SETTINGS.DIFFICULTY_SETTINGS[gameState.difficulty];
    const speed = gameState.activePowerUp?.type === 'slowMotion' 
      ? difficultySettings.moleSpeed * 1.5 
      : difficultySettings.moleSpeed;

    // Intervall för nya moles
    moleInterval.current = window.setInterval(() => {
      // Aktivera ny mole oberoende av hitState
      setActiveMole(Math.floor(Math.random() * GAME_SETTINGS.MOLE_COUNT));
    }, speed);

    // Timer för nedräkning
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

    // Cleanup
    return () => {
      if (moleInterval.current) clearInterval(moleInterval.current);
      if (powerUpTimeout.current) clearTimeout(powerUpTimeout.current);
      if (hitTimeout.current) clearTimeout(hitTimeout.current);
      clearInterval(timer);
    };
  }, [isPlaying, gameState.difficulty, gameState.activePowerUp, updateStats, updateHighScores]);

  return {
    gameState,
    isPlaying,
    activeMole,
    hitMole,
    hitState,
    highScores,
    gameStats,
    handleMoleHit,
    startGame
  };
};