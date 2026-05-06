import { useState } from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import { FACTS, getFactOfDay } from '../../data/facts';

export default function FunFactWidget() {
  const todayFact = getFactOfDay();
  const [fact, setFact] = useState(todayFact);
  const [spinning, setSpinning] = useState(false);

  const shuffle = () => {
    setSpinning(true);
    const random = FACTS[Math.floor(Math.random() * FACTS.length)];
    setFact(random);
    setTimeout(() => setSpinning(false), 400);
  };

  return (
    <div className="glass-dark rounded-3xl p-5 widget-shadow flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-300" />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Fun Fact</span>
        </div>
        <span className="text-xs text-amber-300/70 bg-amber-500/15 px-2 py-0.5 rounded-full">
          {fact.category}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <span className="text-4xl">{fact.emoji}</span>
        <p className="text-white text-sm leading-relaxed">{fact.fact}</p>
      </div>

      <button
        onClick={shuffle}
        className="flex items-center gap-2 text-white/40 hover:text-amber-300 transition-colors text-xs self-end"
      >
        <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
        Another one
      </button>
    </div>
  );
}
