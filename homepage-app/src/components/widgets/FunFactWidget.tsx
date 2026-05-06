import { useState } from 'react';
import { Zap, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useFunFact } from '../../hooks/useFunFact';

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3 flex-1">
      <div className="h-4 w-full bg-white/10 rounded" />
      <div className="h-4 w-4/5 bg-white/10 rounded" />
      <div className="h-4 w-3/5 bg-white/10 rounded" />
    </div>
  );
}

export default function FunFactWidget() {
  const { fact, loading, isLive, fetchAnother } = useFunFact();
  const [spinning, setSpinning] = useState(false);

  const handleAnother = () => {
    setSpinning(true);
    fetchAnother().then(() => setSpinning(false));
  };

  return (
    <div className="glass-dark rounded-3xl p-5 widget-shadow flex flex-col gap-4 min-h-[220px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-300" />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Fun Fact</span>
        </div>
        {!loading && (
          <span className="flex items-center gap-1 text-xs text-amber-300/70 bg-amber-500/15 px-2 py-0.5 rounded-full">
            {isLive ? <Wifi size={10} /> : <WifiOff size={10} />}
            {isLive ? 'Live' : 'Today'}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {loading && <Skeleton />}
        {fact && !loading && (
          <>
            <span className="text-3xl">💡</span>
            <p className="text-white text-sm leading-relaxed">{fact.text}</p>
            {fact.sourceUrl && (
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300/50 text-xs hover:text-amber-300/80 transition-colors"
              >
                Source ↗
              </a>
            )}
          </>
        )}
      </div>

      <button
        onClick={handleAnother}
        className="flex items-center gap-2 text-white/40 hover:text-amber-300 transition-colors text-xs self-end"
      >
        <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
        Another one
      </button>
    </div>
  );
}
