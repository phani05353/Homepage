import { useState } from 'react';
import { Quote, RefreshCw, AlertCircle } from 'lucide-react';
import { useQuote } from '../../hooks/useQuote';

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3 flex-1">
      <div className="h-4 w-full bg-white/10 rounded" />
      <div className="h-4 w-5/6 bg-white/10 rounded" />
      <div className="h-3 w-24 bg-white/10 rounded mt-1" />
    </div>
  );
}

export default function QuoteWidget() {
  const { quote, loading, error, fetchNew } = useQuote();
  const [spinning, setSpinning] = useState(false);

  const handleNew = () => {
    setSpinning(true);
    fetchNew().then(() => setSpinning(false));
  };

  return (
    <div className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 widget-shadow widget-hover flex flex-col gap-3 sm:gap-4 min-h-[200px] sm:min-h-[220px] h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-300/20 flex items-center justify-center">
            <Quote size={13} className="text-emerald-200" />
          </div>
          <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase">
            Quote of the Day
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 pulse-soft" />
          <span className="text-emerald-200/80 text-[10px] uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {loading && <Skeleton />}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-white/40">
            <AlertCircle size={18} />
            <p className="text-xs text-center">{error}</p>
          </div>
        )}

        {quote && !loading && (
          <>
            <p className="text-white/95 text-sm leading-relaxed italic flex-1">"{quote.text}"</p>
            <p className="text-emerald-200/85 text-xs">— {quote.author}</p>
          </>
        )}
      </div>

      <button
        onClick={handleNew}
        disabled={spinning}
        className="flex items-center gap-1.5 text-white/40 hover:text-emerald-200 disabled:opacity-50 transition-colors text-[11px] uppercase tracking-wider self-end"
      >
        <RefreshCw size={11} className={spinning ? 'animate-spin' : ''} />
        New
      </button>
    </div>
  );
}
