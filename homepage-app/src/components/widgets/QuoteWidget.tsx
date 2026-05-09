import { useState } from 'react';
import { Quote, RefreshCw, AlertCircle, ChevronDown } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setExpanded((p) => !p);
  };

  const handleWidgetClick = () => {
    if (!expanded) setExpanded(true);
  };

  const handleNew = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setSpinning(true);
    fetchNew().then(() => setSpinning(false));
  };

  return (
    <div
      onClick={handleWidgetClick}
      className={`glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 widget-shadow widget-hover flex flex-col gap-3 sm:gap-4 ${
        expanded ? 'min-h-[200px] sm:min-h-[220px]' : 'min-h-[88px] cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-300/20 flex items-center justify-center shrink-0">
            <Quote size={13} className="text-emerald-200" />
          </div>
          <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase truncate">
            Quote of the Day
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 pulse-soft" />
            <span className="text-emerald-200/80 text-[10px] uppercase tracking-wider">Live</span>
          </span>
          <button onClick={toggleExpanded} className="text-white/40 hover:text-white p-1 -m-1">
            <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsed preview — show author */}
      {!expanded && quote && (
        <p className="text-white/85 text-xs italic">— {quote.author}</p>
      )}
      {!expanded && !quote && error && (
        <p className="text-red-200/80 text-xs">{error}</p>
      )}

      {/* Expanded body */}
      {expanded && (
        <>
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
        </>
      )}
    </div>
  );
}
