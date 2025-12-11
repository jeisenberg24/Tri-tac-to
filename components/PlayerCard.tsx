import React from 'react';
import { PlayerConfig } from '../types';
import { getPlayerIcon } from '../constants';

interface PlayerCardProps {
  player: PlayerConfig;
  isActive: boolean;
  isWinner?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, isWinner }) => {
  const activeClass = isActive 
    ? "bg-slate-700 ring-2 ring-offset-2 ring-offset-slate-900 border-transparent translate-y-[-4px]" 
    : "bg-slate-800/50 border-slate-700 opacity-70 scale-95";
  
  const winnerClass = isWinner ? "ring-yellow-400 ring-offset-yellow-400/20 !opacity-100 !scale-105" : "";
  
  const ringColorMap: Record<string, string> = {
      rose: "ring-rose-500",
      sky: "ring-sky-500",
      emerald: "ring-emerald-500",
  };

  const ringClass = isActive ? ringColorMap[player.color] : "";

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 w-full ${activeClass} ${ringClass} ${winnerClass}`}>
       <div className={`mb-2 p-2 rounded-full bg-slate-900 shadow-inner`}>
          {getPlayerIcon(player.icon, `w-6 h-6 sm:w-8 sm:h-8 text-${player.color}-500`)}
       </div>
       <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider text-${player.color}-400`}>
         {player.name}
       </span>
       {isActive && !isWinner && (
         <span className="mt-1 text-[10px] text-slate-400 animate-pulse">Thinking...</span>
       )}
       {isWinner && (
         <span className="mt-1 text-[10px] font-bold text-yellow-400 animate-bounce">WINNER!</span>
       )}
    </div>
  );
};

export default PlayerCard;
