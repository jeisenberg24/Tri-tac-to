export type PlayerId = 0 | 1 | 2;

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  color: string; // Tailwind color class base (e.g. "rose")
  icon: 'X' | 'O' | 'Triangle';
}

export type CellValue = PlayerId | null;

export interface BoardState {
  grid: CellValue[];
  size: number;
  winLength: number;
}

export interface GameState {
  board: BoardState;
  currentPlayer: PlayerId;
  winner: PlayerId | 'draw' | null;
  winningCells: number[] | null;
  history: CellValue[][];
  isAiCommenting: boolean;
}
