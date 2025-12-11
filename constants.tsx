import { PlayerConfig } from './types';
import { X, Circle, Triangle } from 'lucide-react';
import React from 'react';

export const GRID_SIZE = 6;
export const WIN_LENGTH = 4;

export const PLAYERS: PlayerConfig[] = [
  { id: 0, name: "Red Striker", color: "rose", icon: 'X' },
  { id: 1, name: "Blue Guardian", color: "sky", icon: 'O' },
  { id: 2, name: "Green Ranger", color: "emerald", icon: 'Triangle' },
];

export const getPlayerIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case 'X': return <X className={className} strokeWidth={3} />;
    case 'O': return <Circle className={className} strokeWidth={3} />;
    case 'Triangle': return <Triangle className={className} strokeWidth={3} />;
    default: return null;
  }
};
