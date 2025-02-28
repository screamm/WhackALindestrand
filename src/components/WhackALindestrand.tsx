// src/components/WhackALindestrand.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameLogic } from '../hooks/useGameLogic';
import type { Difficulty } from '../types';

// Components
import { Controls } from './game/Controls';
import { GameHeader } from './game/GameHeader';
import { GameGrid } from './game/GameGrid';
import { IntroScreen } from './game/IntroScreen';
import { GameOverScreen } from './game/GameOverScreen';

// Assets
import alicia from '../assets/alicia.png';
import alicia2 from '../assets/alicia2.png';
import alexander from '../assets/alexander.png';
import alexander2 from '../assets/alexander2.png';

import hitAliciaSound from '../assets/hitalicia.wav';
import hitAlexanderSound from '../assets/hitalexander.wav';
import powerUpSound from '../assets/powerup.wav';
import startSound from '../assets/start.wav';
import gameOverSound from '../assets/gameover.wav';

const WhackALindestrand: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);
  const [characterMode, setCharacterMode] = useState<'alicia' | 'alexander' | 'mixed'>('mixed');

  const hitAliciaAudio = useRef<HTMLAudioElement>(new Audio(hitAliciaSound));
  const hitAlexanderAudio = useRef<HTMLAudioElement>(new Audio(hitAlexanderSound));
  const powerUpAudio = useRef<HTMLAudioElement>(new Audio(powerUpSound));
  const startAudio = useRef<HTMLAudioElement>(new Audio(startSound));
  const gameOverAudio = useRef<HTMLAudioElement>(new Audio(gameOverSound));

  const {
    gameState,
    isPlaying,
    activeMole,
    hitMole,  // Ny state från useGameLogic
    highScores,
    gameStats,
    handleMoleHit,
    startGame
  } = useGameLogic(playerName);

  // Förladda ljud för att eliminera initial fördröjning
  useEffect(() => {
    // Förladda ljud när komponenten mountas
    const preloadAudio = (audio: HTMLAudioElement) => {
      audio.load();
      audio.volume = 0.7; // 70% volym
    };
    
    preloadAudio(hitAliciaAudio.current);
    preloadAudio(hitAlexanderAudio.current);
    preloadAudio(powerUpAudio.current);
    preloadAudio(startAudio.current);
    preloadAudio(gameOverAudio.current);
  }, []);

  const playSound = useCallback((audio: HTMLAudioElement) => {
    if (!muted) {
      // Återställ ljudet till början
      audio.currentTime = 0;
      
      // Spela med en kort fördröjning för att synka med bildändringar
      setTimeout(() => {
        audio.play().catch(() => {
          // Hantera error tyst
        });
      }, 50); // 50ms fördröjning
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
    playSound(startAudio.current);
    
    // Kort fördröjning innan spelet startar så ljudet hinner spelas
    setTimeout(() => {
      setShowIntro(false);
      startGame(difficulty);
    }, 200); // 200ms fördröjning
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
      if (prev === 'mixed') return 'alicia';
      if (prev === 'alicia') return 'alexander';
      return 'mixed';
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <Controls
        characterMode={characterMode}
        muted={muted}
        onToggleCharacter={toggleCharacter}
        onToggleMuted={() => setMuted(!muted)}
      />

      <AnimatePresence>
        {showIntro && (
          <IntroScreen
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onStartGame={handleGameStart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPlaying && !showIntro && (
          <GameOverScreen
            gameState={gameState}
            gameStats={gameStats}
            highScores={highScores}
            onPlayAgain={(difficulty) => handleGameStart(difficulty)}
            onChangeDifficulty={() => setShowIntro(true)}
          />
        )}
      </AnimatePresence>

      {isPlaying && (
        <>
          <GameHeader gameState={gameState} />
          <GameGrid
            activeMole={activeMole}
            hitMole={hitMole}  // Skicka hitMole state till GameGrid
            characterMode={characterMode}
            onHit={handleHit}
            images={{ alicia, alicia2, alexander, alexander2 }}
          />
        </>
      )}
    </div>
  );
};

export default WhackALindestrand;