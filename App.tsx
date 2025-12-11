import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, WIN_LENGTH, PLAYERS } from './constants';
import { CellValue, PlayerId, GameState } from './types';
import { checkWinner, isBoardFull } from './utils/gameLogic';
import Cell from './components/Cell';
import PlayerCard from './components/PlayerCard';
import RulesModal from './components/RulesModal';
import { generateCommentary } from './services/geminiService';
import { Info, RefreshCw, MessageSquare, Trophy, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // Game State
  const [grid, setGrid] = useState<CellValue[]>(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0);
  const [winner, setWinner] = useState<PlayerId | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<number[] | null>(null);
  const [history, setHistory] = useState<CellValue[][]>([]);
  const [lastMoveIdx, setLastMoveIdx] = useState<number | null>(null);
  
  // UI State
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [commentary, setCommentary] = useState<string>("Welcome to the arena! 3 players enter, 1 leaves victorious.");
  const [isCommenting, setIsCommenting] = useState(false);

  // Initialize Commentary on Mount
  useEffect(() => {
    // Only show rules on very first load
    setIsRulesOpen(true);
  }, []);

  // Handlers
  const handleCellClick = useCallback(async (index: number) => {
    if (grid[index] !== null || winner !== null) return;

    // Execute Move
    const newGrid = [...grid];
    newGrid[index] = PLAYERS[currentPlayerIdx].id;
    
    setGrid(newGrid);
    setLastMoveIdx(index);
    setHistory(prev => [...prev, grid]); // Save history before move for 'undo' potentially, but here just storing

    // Check Win
    const { winner: newWinner, winningCells: cells } = checkWinner(newGrid, GRID_SIZE, WIN_LENGTH);
    
    let nextStatus: 'ongoing' | 'win' | 'draw' = 'ongoing';

    if (newWinner !== null) {
      setWinner(newWinner);
      setWinningCells(cells);
      nextStatus = 'win';
    } else if (isBoardFull(newGrid)) {
      setWinner('draw');
      nextStatus = 'draw';
    } else {
      setCurrentPlayerIdx((prev) => (prev + 1) % 3);
    }

    // Trigger AI Commentary
    if (isAiEnabled) {
      setIsCommenting(true);
      try {
        const comment = await generateCommentary(
            newGrid, 
            index, 
            PLAYERS[currentPlayerIdx], 
            nextStatus
        );
        setCommentary(comment);
      } catch (e) {
        console.error("AI Error", e);
      } finally {
        setIsCommenting(false);
      }
    }

  }, [grid, currentPlayerIdx, winner, isAiEnabled]);

  const handleReset = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(null));
    setCurrentPlayerIdx(0);
    setWinner(null);
    setWinningCells(null);
    setLastMoveIdx(null);
    setCommentary("New game started! Clean slate.");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full max-w-6xl mx-auto p-4 gap-6 overflow-hidden">
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

        {/* Sidebar / Top Bar (Mobile) - Player Info & Controls */}
        <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0 z-10">
            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-black italic tracking-wider bg-gradient-to-r from-rose-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                        TRI-TAC-TOE
                    </h1>
                    <button onClick={() => setIsRulesOpen(true)} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                        <Info size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                    {PLAYERS.map((p, idx) => (
                        <PlayerCard 
                            key={p.id} 
                            player={p} 
                            isActive={currentPlayerIdx === idx && !winner} 
                            isWinner={winner === p.id}
                        />
                    ))}
                </div>
            </div>

            {/* Commentary Box */}
            <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-700 p-4 relative overflow-hidden flex flex-col min-h-[120px]">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                        <MessageSquare size={14} />
                        AI Commentary
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] text-slate-500 uppercase font-bold cursor-pointer hover:text-slate-300">
                             {isAiEnabled ? "On" : "Off"}
                             <input type="checkbox" className="hidden" checked={isAiEnabled} onChange={() => setIsAiEnabled(!isAiEnabled)} />
                        </label>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-center">
                    {isCommenting ? (
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </div>
                    ) : (
                        <p className={`text-sm md:text-base font-medium leading-relaxed transition-all duration-500 ${winner ? 'text-yellow-300' : 'text-slate-300'}`}>
                            "{commentary}"
                        </p>
                    )}
                </div>
            </div>

            {/* Controls */}
             <button 
                onClick={handleReset}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-600 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
                <RefreshCw size={20} />
                Reset Arena
            </button>
        </div>

        {/* Main Game Board */}
        <div className="flex-1 flex items-center justify-center p-2 md:p-6 overflow-y-auto scrollbar-hide">
            <div className="relative w-full max-w-[600px] aspect-square">
                 {/* Status Overlay for Win/Draw */}
                {(winner !== null) && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-3xl animate-in fade-in zoom-in duration-300">
                         <div className="bg-slate-900 border-2 border-slate-600 p-8 rounded-2xl shadow-2xl text-center transform scale-110">
                            {winner === 'draw' ? (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <AlertTriangle size={48} className="mb-2 text-yellow-500" />
                                    <h2 className="text-3xl font-black mb-1">DRAW!</h2>
                                    <p className="text-sm uppercase tracking-widest">No moves left</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                     <Trophy size={56} className={`mb-4 text-${PLAYERS[winner].color}-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-bounce`} />
                                     <h2 className="text-4xl font-black text-white mb-2">{PLAYERS[winner].name}</h2>
                                     <p className={`text-lg font-bold text-${PLAYERS[winner].color}-400 uppercase`}>Victory!</p>
                                </div>
                            )}
                            <button 
                                onClick={handleReset}
                                className="mt-6 px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-lg"
                            >
                                Play Again
                            </button>
                         </div>
                    </div>
                )}

                {/* Grid */}
                <div 
                    className="grid gap-2 w-full h-full p-3 bg-slate-800/40 rounded-3xl border border-slate-700 shadow-2xl"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                >
                    {grid.map((cellValue, index) => (
                        <Cell
                            key={index}
                            index={index}
                            value={cellValue}
                            onClick={() => handleCellClick(index)}
                            disabled={cellValue !== null || winner !== null}
                            isWinning={winningCells?.includes(index) ?? false}
                            lastMove={index === lastMoveIdx}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default App;
