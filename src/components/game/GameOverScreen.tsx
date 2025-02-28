// src/components/game/GameOverScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { GameState, GameStats, HighScore, Difficulty } from '../../types';

interface GameOverScreenProps {
  gameState: GameState;
  gameStats: GameStats;
  highScores: HighScore[];
  onPlayAgain: (difficulty: Difficulty) => void;
  onChangeDifficulty: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState,
  gameStats,
  highScores,
  onPlayAgain,
  onChangeDifficulty
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30"
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-96 max-w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Spelet är slut!</h2>
        <div className="space-y-4 mb-6">
          <p className="text-xl">Poäng: {gameState.score}</p>
          <p>Längsta streak: {gameState.streak}</p>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Statistik</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Totalt antal spel:</p>
              <p className="text-right">{gameStats.totalGames}</p>
              <p>Total poäng:</p>
              <p className="text-right">{gameStats.totalScore}</p>
              <p>Bästa poäng:</p>
              <p className="text-right">{gameStats.bestScore}</p>
              <p>Längsta streak:</p>
              <p className="text-right">{gameStats.longestStreak}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Topplista</h3>
            <div className="space-y-2">
              {highScores.map((score, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{index + 1}. {score.name}</span>
                  <span className="font-bold">{score.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onPlayAgain(gameState.difficulty)}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Spela igen
          </button>
          <button 
            onClick={onChangeDifficulty}
            className="p-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Byt svårighet
          </button>
        </div>
      </div>
    </motion.div>
  );
};