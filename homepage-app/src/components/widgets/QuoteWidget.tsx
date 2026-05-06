import { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
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
    <div className="glass-dark rounded-3xl p-5 widget-shadow flex flex-col gap-4 min-h-[220px]">
      <div className="flex items-center gap-2">
        <Quote size={16} className="text-emerald-300" />
        <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Quote of the Day</span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {loading && <Skeleton />}
        {error && <p className="text-white/40 text-sm my-auto">{error}</p>}
        {quote && !loading && (
          <>
            <p className="text-white text-sm leading-relaxed italic flex-1">"{quote.text}"</p>
            <p className="text-emerald-300/80 text-xs">— {quote.author}</p>
          </>
        )}
      </div>

      <button
        onClick={handleNew}
        className="flex items-center gap-2 text-white/40 hover:text-emerald-300 transition-colors text-xs self-end"
      >
        <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
        New quote
      </button>
    </div>
  );
}
