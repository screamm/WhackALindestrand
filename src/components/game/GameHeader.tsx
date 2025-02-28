// src/components/game/GameHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../../types';
import { POWER_UPS } from '../../constants';

interface GameHeaderProps {
  gameState: GameState;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-20"
    >
      <div className="flex space-x-4">
        <span className="font-medium">Poäng: {gameState.score}</span>
        <span className="font-medium">Streak: {gameState.streak}</span>
      </div>
      <div className="flex items-center space-x-2">
        {gameState.activePowerUp && (
          <span className="bg-yellow-100 px-2 py-1 rounded-full text-sm">
            {POWER_UPS[gameState.activePowerUp.type].icon}
          </span>
        )}
        <span className="font-medium">Tid: {gameState.timeLeft}s</span>
      </div>
    </motion.div>
  );
};