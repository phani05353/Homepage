import { useState } from 'react';
import { Zap, RefreshCw, AlertCircle, ChevronDown } from 'lucide-react';
import { useFunFact } from '../../hooks/useFunFact';

export default function FunFactWidget() {
  const { fact, loading, error, fetchAnother } = useFunFact();
  const [spinning, setSpinning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setExpanded((p) => !p);
  };

  const handleWidgetClick = () => {
    if (!expanded) setExpanded(true);
  };

  const handleAnother = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setSpinning(true);
    fetchAnother().then(() => setSpinning(false));
  };

  // Short preview for collapsed state — first sentence or ~70 chars
  const preview = fact?.text
    ? fact.text.length > 70
      ? fact.text.slice(0, 70).trimEnd() + '…'
      : fact.text
    : null;

  return (
    <div
      onClick={handleWidgetClick}
      className={`glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 widget-shadow widget-hover flex flex-col gap-3 sm:gap-4 ${
        expanded ? 'min-h-[200px] sm:min-h-[220px]' : 'min-h-[88px] cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 ring-1 ring-amber-300/20 flex items-center justify-center shrink-0">
            <Zap size={13} className="text-amber-200" />
          </div>
          <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase truncate">
            Fun Fact
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 pulse-soft" />
            <span className="text-amber-200/80 text-[10px] uppercase tracking-wider">Live</span>
          </span>
          <button onClick={toggleExpanded} className="text-white/40 hover:text-white p-1 -m-1">
            <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsed preview */}
      {!expanded && preview && (
        <p className="text-white/85 text-xs leading-snug">{preview}</p>
      )}
      {!expanded && !fact && error && (
        <p className="text-red-200/80 text-xs">{error}</p>
      )}

      {/* Expanded body */}
      {expanded && (
        <>
          <div className="flex-1 flex flex-col gap-3">
            {loading && (
              <div className="animate-pulse flex flex-col gap-3 flex-1">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-4/5 bg-white/10 rounded" />
                <div className="h-4 w-3/5 bg-white/10 rounded" />
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 text-white/40">
                <AlertCircle size={18} />
                <p className="text-xs text-center">{error}</p>
              </div>
            )}

            {fact && !loading && (
              <>
                <span className="text-2xl">💡</span>
                <p className="text-white/95 text-sm leading-relaxed">{fact.text}</p>
              </>
            )}
          </div>

          <button
            onClick={handleAnother}
            disabled={spinning}
            className="flex items-center gap-1.5 text-white/40 hover:text-amber-200 disabled:opacity-50 transition-colors text-[11px] uppercase tracking-wider self-end"
          >
            <RefreshCw size={11} className={spinning ? 'animate-spin' : ''} />
            Another
          </button>
        </>
      )}
    </div>
  );
}
