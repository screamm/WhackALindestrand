// src/components/game/MoleButton.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface MoleButtonProps {
  index: number;
  isActive: boolean;
  isHit: boolean;  // Ny prop som kommer från hitMole === index
  characterMode: 'alicia' | 'alexander' | 'mixed';
  onHit: (index: number) => void;
  images: {
    alicia: string;
    alicia2: string;
    alexander: string;
    alexander2: string;
  };
}

export const MoleButton: React.FC<MoleButtonProps> = ({
  index,
  isActive,
  isHit,
  characterMode,
  onHit,
  images: { alicia, alicia2, alexander, alexander2 }
}) => {
  // Bestäm vilken karaktär som ska visas
  const character = characterMode === 'mixed'
    ? (index % 2 === 0 ? 'alicia' : 'alexander')
    : characterMode;
  
  // Bestäm vilken bild som ska visas
  const normalImage = character === 'alicia' ? alicia : alexander;
  const hitImage = character === 'alicia' ? alicia2 : alexander2;
  
  // Loggning för debugging
  useEffect(() => {
    if (isHit) {
    //   console.log(`MoleButton ${index} is now in hit state, character: ${character}`);
    }
  }, [isHit, index, character]);
  
  // Hantera klick
  const handleClick = () => {
    if (isActive && !isHit) {
    //   console.log(`MoleButton ${index} clicked`);
      onHit(index);
    }
  };
  
  // Om varken aktiv eller träffad, visa bara en tom knapp
  if (!isActive && !isHit) {
    return (
      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg bg-slate-200 shadow-lg"></div>
    );
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden shadow-lg relative
        ${isActive ? 'bg-slate-300' : 'bg-slate-200'}
        ${isHit ? 'ring-2 ring-red-500' : ''}`}
      onClick={handleClick}
      data-hit={isHit ? 'true' : 'false'}
      data-character={character}
    >
      {/* Visa den korrekta bilden baserat på hit-state */}
      <img 
        src={isHit ? hitImage : normalImage}
        alt={`${character} ${isHit ? 'hit' : 'normal'}`}
        className="w-full h-full object-cover"
        style={{ display: 'block' }} // Säkerställ att bilden visas
      />
      
      {/* Debug-overlay (kan tas bort i produktion) */}
      {/* <div className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1">
        {character}{isHit ? '2' : ''}
      </div> */}
    </motion.button>
  );
};