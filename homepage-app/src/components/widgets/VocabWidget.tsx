import { useState } from 'react';
import { BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { useWordOfDay } from '../../hooks/useWordOfDay';

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3 items-center justify-center flex-1">
      <div className="h-7 w-36 bg-white/10 rounded-lg" />
      <div className="h-4 w-24 bg-white/10 rounded" />
      <div className="h-3 w-20 bg-white/10 rounded" />
    </div>
  );
}

export default function VocabWidget() {
  const { data, loading, error, changeWord } = useWordOfDay();
  const [flipped, setFlipped] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleChange = () => {
    setSpinning(true);
    setFlipped(false);
    changeWord().then(() => setSpinning(false));
  };

  return (
    <div className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 widget-shadow widget-hover flex flex-col gap-3 sm:gap-4 min-h-[200px] sm:min-h-[220px]">
      {/* Header — icon in tinted circle + label + live dot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-violet-500/20 ring-1 ring-violet-300/20 flex items-center justify-center">
            <BookOpen size={13} className="text-violet-200" />
          </div>
          <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase">
            Word of the Day
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-300 pulse-soft" />
          <span className="text-violet-200/80 text-[10px] uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Inline error toast */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-400/20">
          <AlertCircle size={14} className="text-red-300 shrink-0" />
          <p className="text-red-200/90 text-xs leading-tight">{error}</p>
        </div>
      )}

      {loading && <Skeleton />}
      {!loading && !data && !error && <Skeleton />}

      {!loading && !data && error && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-white/40">
          <AlertCircle size={20} />
          <p className="text-xs text-center">No cached word available</p>
        </div>
      )}

      {data && !loading && (
        <>
          <div
            className="relative flex-1 cursor-pointer"
            style={{ perspective: '1000px', minHeight: 140 }}
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="w-full h-full transition-all duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                minHeight: 140,
              }}
            >
              {/* Front — flat, no inner card surface, matches other widgets */}
              <div
                className="absolute inset-0 flex flex-col justify-center items-center gap-1.5"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-3xl font-semibold text-white capitalize tracking-tight">{data.word}</p>
                {data.phonetic && <p className="text-white/55 text-sm font-mono">{data.phonetic}</p>}
                <span className="text-[10px] text-violet-200/75 italic uppercase tracking-[0.18em] mt-0.5">{data.partOfSpeech}</span>
                <p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.18em]">Tap to reveal</p>
              </div>

              {/* Back — subtly elevated to signal the reveal state */}
              <div
                className="absolute inset-0 flex flex-col justify-center gap-2.5 rounded-xl bg-violet-500/10 border border-violet-300/15 px-3 py-3"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <p className="text-white/95 text-sm leading-relaxed">{data.meaning}</p>
                {data.example && (
                  <p className="text-white/55 text-xs italic">"{data.example}"</p>
                )}
                {data.origin && (
                  <p className="text-violet-200/65 text-[10px] uppercase tracking-[0.18em]">Origin · {data.origin}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleChange}
            disabled={spinning}
            className="flex items-center gap-1.5 text-white/40 hover:text-violet-200 disabled:opacity-50 transition-colors text-[11px] uppercase tracking-wider self-end"
          >
            <RefreshCw size={11} className={spinning ? 'animate-spin' : ''} />
            {spinning ? 'Loading' : 'Change'}
          </button>
        </>
      )}
    </div>
  );
}
