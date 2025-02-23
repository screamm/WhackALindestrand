// src/types.ts

export interface HighScore {
    name: string;
    score: number;
    date: string;
  }
  
  export interface GameStats {
    totalGames: number;
    totalScore: number;
    bestScore: number;
    longestStreak: number;
  }
  
  export interface PowerUp {
    type: 'doublePoints' | 'slowMotion' | 'extraTime';
    duration: number;
    active: boolean;
  }
  
  export type Difficulty = 'easy' | 'normal' | 'hard';
  
  export interface GameState {
    score: number;
    timeLeft: number;
    streak: number;
    activePowerUp: PowerUp | null;
    difficulty: Difficulty;
  }