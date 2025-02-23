import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameLogic } from './hooks/useGameLogic';
import { Difficulty } from './types';
import { GAME_SETTINGS, POWER_UPS } from './constants';

// Assets
import alicia from './assets/alicia.png';
import alicia2 from './assets/alicia2.png';
import alexander from './assets/alexander.png';
import alexander2 from './assets/alexander2.png';

import hitAliciaSound from './assets/hitalicia.wav';
import hitAlexanderSound from './assets/hitalexander.wav';
import powerUpSound from './assets/powerup.wav';
import startSound from './assets/start.wav';
import gameOverSound from './assets/gameover.wav';

const WhackAMole: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);
  const [characterMode, setCharacterMode] = useState<'alicia' | 'alexander' | 'mixed'>('alicia');

  // Audio refs
  const hitAliciaAudio = useRef<HTMLAudioElement>(new Audio(hitAliciaSound));
  const hitAlexanderAudio = useRef<HTMLAudioElement>(new Audio(hitAlexanderSound));
  const powerUpAudio = useRef<HTMLAudioElement>(new Audio(powerUpSound));
  const startAudio = useRef<HTMLAudioElement>(new Audio(startSound));
  const gameOverAudio = useRef<HTMLAudioElement>(new Audio(gameOverSound));

  const {
    gameState,
    isPlaying,
    activeMole,
    hitState,
    highScores,
    gameStats,
    handleMoleHit,
    startGame
  } = useGameLogic(playerName);

  const playSound = useCallback((audio: HTMLAudioElement) => {
    if (!muted) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Handle audio play error silently
      });
    }
  }, [muted]);

  useEffect(() => {
    if (gameState.activePowerUp) {
      playSound(powerUpAudio.current);
    }
  }, [gameState.activePowerUp, playSound]);

  const getCurrentCharacter = useCallback((index: number): 'alicia' | 'alexander' => {
    if (characterMode === 'mixed') {
      return index % 2 === 0 ? 'alicia' : 'alexander';
    }
    return characterMode;
  }, [characterMode]);

  const handleHit = (index: number) => {
    if (index === activeMole && isPlaying) {
      handleMoleHit(index);
      const currentCharacter = getCurrentCharacter(index);
      playSound(currentCharacter === 'alicia' ? hitAliciaAudio.current : hitAlexanderAudio.current);
      
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleGameStart = (difficulty: Difficulty) => {
    setShowIntro(false);
    startGame(difficulty);
    playSound(startAudio.current);
  };

  const handleGameOver = useCallback(() => {
    playSound(gameOverAudio.current);
  }, [playSound]);

  useEffect(() => {
    if (!isPlaying && !showIntro) {
      handleGameOver();
    }
  }, [isPlaying, showIntro, handleGameOver]);

  const toggleCharacter = () => {
    setCharacterMode(prev => {
      if (prev === 'alicia') return 'alexander';
      if (prev === 'alexander') return 'mixed';
      return 'alicia';
    });
  };

  const getMoleImage = (index: number): string | undefined => {
    if (index !== activeMole || !isPlaying) return undefined;
    
    const currentCharacter = getCurrentCharacter(index);
    if (hitState) {
      return currentCharacter === 'alicia' ? alicia2 : alexander2;
    }
    return currentCharacter === 'alicia' ? alicia : alexander;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Controls */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button 
          onClick={toggleCharacter}
          className="p-3 rounded-full bg-white shadow-md text-xl hover:bg-gray-100 transition-colors"
          title="Byt karaktär"
        >
          {characterMode === 'alicia' ? '👧' : characterMode === 'alexander' ? '👦' : '👧👦'}
        </button>
        <button 
          onClick={() => setMuted(!muted)}
          className="p-3 rounded-full bg-white shadow-md text-xl hover:bg-gray-100 transition-colors"
          title={muted ? "Sätt på ljud" : "Stäng av ljud"}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Intro screen */}
      <AnimatePresence>
        {showIntro && (
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
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Skriv ditt namn här"
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleGameStart('easy')}
                  className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={!playerName.trim()}
                >
                  Lätt
                </button>
                <button
                  onClick={() => handleGameStart('normal')}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={!playerName.trim()}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleGameStart('hard')}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={!playerName.trim()}
                >
                  Svår
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over screen */}
      <AnimatePresence>
        {!isPlaying && !showIntro && (
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
                  onClick={() => handleGameStart(gameState.difficulty)}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Spela igen
                </button>
                <button 
                  onClick={() => setShowIntro(true)}
                  className="p-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Byt svårighet
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game area */}
      {isPlaying && (
        <>
          {/* Header with score and time */}
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

          {/* Game grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-20">
            {Array.from({ length: GAME_SETTINGS.MOLE_COUNT }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden shadow-lg
                  ${activeMole === index ? 'bg-slate-300' : 'bg-slate-200'}`}
                onClick={() => handleHit(index)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleHit(index);
                }}
              >
                {getMoleImage(index) && (
                  <motion.img 
                    src={getMoleImage(index)}
                    alt={`${getCurrentCharacter(index) === 'alicia' ? 'Alicia' : 'Alexander'}`}
                    className="w-full h-full object-cover"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WhackAMole;