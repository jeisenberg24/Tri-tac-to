import React from 'react';
import { PlayerConfig, PlayerId } from '../types';
import { getPlayerIcon, PLAYERS } from '../constants';

interface CellProps {
  value: PlayerId | null;
  index: number;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
  lastMove: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, disabled, isWinning, lastMove }) => {
  const playerConfig: PlayerConfig | undefined = value !== null ? PLAYERS[value] : undefined;

  let baseClasses = "relative w-full h-full aspect-square rounded-xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 transform active:scale-95 shadow-sm";
  let colorClasses = "bg-slate-800 hover:bg-slate-700 border-2 border-slate-700";
  let iconContent = null;

  if (playerConfig) {
    const color = playerConfig.color;
    // Dynamic color mapping for Tailwind content to be picked up, explicit classes needed often, 
    // but here we use style or standard mappings if possible. 
    // For safety with arbitrary strings, we'll map manually or assume a set.
    
    const colorMap: Record<string, string> = {
      rose: "bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
      sky: "bg-sky-500/20 border-sky-500 text-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]",
      emerald: "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    };

    const winMap: Record<string, string> = {
        rose: "bg-rose-500 text-white border-rose-400 scale-105 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-10",
        sky: "bg-sky-500 text-white border-sky-400 scale-105 shadow-[0_0_20px_rgba(14,165,233,0.6)] z-10",
        emerald: "bg-emerald-500 text-white border-emerald-400 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.6)] z-10",
    }

    if (isWinning) {
      colorClasses = winMap[playerConfig.color] || colorClasses;
    } else {
      colorClasses = colorMap[playerConfig.color] || colorClasses;
    }
    
    iconContent = getPlayerIcon(playerConfig.icon, "w-1/2 h-1/2 drop-shadow-md");
  }

  return (
    <button
      className={`${baseClasses} ${colorClasses} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value !== null ? `Player ${value + 1}` : "Empty cell"}
    >
      {iconContent}
      {lastMove && !isWinning && (
         <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-pulse shadow-md" />
      )}
    </button>
  );
};

export default React.memo(Cell);
