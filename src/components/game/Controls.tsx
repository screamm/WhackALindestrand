// src/components/game/Controls.tsx
import React from 'react';

interface ControlsProps {
  characterMode: 'alicia' | 'alexander' | 'mixed';
  muted: boolean;
  onToggleCharacter: () => void;
  onToggleMuted: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  characterMode,
  muted,
  onToggleCharacter,
  onToggleMuted
}) => {
  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <button 
        onClick={onToggleCharacter}
        className="p-3 rounded-full bg-white shadow-md text-xl hover:bg-gray-100 transition-colors"
        title="Byt karaktär"
      >
        {characterMode === 'alicia' ? '👧' : characterMode === 'alexander' ? '👦' : '👧👦'}
      </button>
      <button 
        onClick={onToggleMuted}
        className="p-3 rounded-full bg-white shadow-md text-xl hover:bg-gray-100 transition-colors"
        title={muted ? "Sätt på ljud" : "Stäng av ljud"}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};