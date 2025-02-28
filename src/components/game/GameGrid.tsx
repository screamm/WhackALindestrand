// src/components/game/GameGrid.tsx
import React from 'react';
import { MoleButton } from './MoleButton';
import { GAME_SETTINGS } from '../../constants';

interface GameGridProps {
  activeMole: number;
  hitMole: number;  // Ny prop från useGameLogic
  characterMode: 'alicia' | 'alexander' | 'mixed';
  onHit: (index: number) => void;
  images: {
    alicia: string;
    alicia2: string;
    alexander: string;
    alexander2: string;
  };
}

export const GameGrid: React.FC<GameGridProps> = ({
  activeMole,
  hitMole,
  characterMode,
  onHit,
  images
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-6 mt-20">
      {Array.from({ length: GAME_SETTINGS.MOLE_COUNT }).map((_, index) => (
        <MoleButton
          key={index}
          index={index}
          isActive={activeMole === index}
          isHit={hitMole === index}  // Skicka in om denna mole är den träffade
          characterMode={characterMode}
          onHit={onHit}
          images={images}
        />
      ))}
    </div>
  );
};