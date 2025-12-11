import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl transform scale-100 transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">How to Play</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4 text-slate-300">
          <div className="flex items-start gap-3">
             <span className="bg-slate-700 text-white font-bold rounded-lg w-8 h-8 flex-shrink-0 flex items-center justify-center">1</span>
             <p>There are <span className="font-bold text-rose-400">3 Players</span> competing on a 6x6 grid.</p>
          </div>
          <div className="flex items-start gap-3">
             <span className="bg-slate-700 text-white font-bold rounded-lg w-8 h-8 flex-shrink-0 flex items-center justify-center">2</span>
             <p>Take turns placing your symbol. Turns rotate: Red → Blue → Green.</p>
          </div>
          <div className="flex items-start gap-3">
             <span className="bg-slate-700 text-white font-bold rounded-lg w-8 h-8 flex-shrink-0 flex items-center justify-center">3</span>
             <p>The goal is to align <span className="font-bold text-yellow-400">4 symbols</span> in a row.</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg text-sm border border-slate-700 mt-2">
            Lines can be horizontal, vertical, or diagonal. With 3 players, blocking your opponents is just as important as building your own line!
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all"
        >
          Got it, Let's Fight!
        </button>
      </div>
    </div>
  );
};

export default RulesModal;
