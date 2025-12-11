import { CellValue, PlayerId } from '../types';

export const checkWinner = (
  grid: CellValue[],
  size: number,
  winLength: number
): { winner: PlayerId | null; winningCells: number[] | null } => {
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal Down-Right
    [1, -1],  // Diagonal Down-Left
  ];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      const player = grid[index];

      if (player === null) continue;

      for (const [dr, dc] of directions) {
        let line: number[] = [index];
        let match = true;

        for (let step = 1; step < winLength; step++) {
          const r = row + dr * step;
          const c = col + dc * step;

          if (r < 0 || r >= size || c < 0 || c >= size) {
            match = false;
            break;
          }

          const nextIndex = r * size + c;
          if (grid[nextIndex] !== player) {
            match = false;
            break;
          }
          line.push(nextIndex);
        }

        if (match) {
          return { winner: player, winningCells: line };
        }
      }
    }
  }

  return { winner: null, winningCells: null };
};

export const isBoardFull = (grid: CellValue[]): boolean => {
  return grid.every((cell) => cell !== null);
};
