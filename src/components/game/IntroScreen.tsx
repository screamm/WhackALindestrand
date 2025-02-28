// src/components/game/IntroScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { Difficulty } from '../../types';

interface IntroScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartGame: (difficulty: Difficulty) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  playerName,
  onPlayerNameChange,
  onStartGame
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-6">Välkommen till Whack-A-Lindestrand!</h2>
        <p className="mb-4">Försök träffa Alicia och Alexander när de dyker upp. Ju snabbare du är, desto fler poäng!</p>
        <ul className="mb-6 space-y-2">
          <li>✨ Samla powerups för extra poäng</li>
          <li>🎯 Bygg upp en streak för bonuspoäng</li>
          <li>⏰ Se upp för tidsgränsen!</li>
        </ul>
        <input
          type="text"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="Skriv ditt namn här"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onStartGame('easy')}
            className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={!playerName.trim()}
          >
            Lätt
          </button>
          <button
            onClick={() => onStartGame('normal')}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={!playerName.trim()}
          >
            Normal
          </button>
          <button
            onClick={() => onStartGame('hard')}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={!playerName.trim()}
          >
            Svår
          </button>
        </div>
      </div>
    </motion.div>
  );
};