import { useState } from 'react';
import { BookOpen, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const stop = (evt: React.MouseEvent) => evt.stopPropagation();

  const toggleExpanded = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleWidgetClick = () => {
    if (!expanded) setExpanded(true);
  };

  const handleChange = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setSpinning(true);
    setFlipped(false);
    changeWord().then(() => setSpinning(false));
  };

  return (
    <div
      onClick={handleWidgetClick}
      className={`glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 widget-shadow widget-hover flex flex-col gap-2.5 sm:gap-3 ${
        expanded ? 'min-h-[200px] sm:min-h-[220px]' : 'min-h-[110px] cursor-pointer'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-violet-500/20 ring-1 ring-violet-300/20 flex items-center justify-center shrink-0">
            <BookOpen size={13} className="text-violet-200" />
          </div>
          <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase truncate">
            Word of the Day
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-300 pulse-soft" />
            <span className="text-violet-200/80 text-[10px] uppercase tracking-wider">Live</span>
          </span>
          <button onClick={toggleExpanded} className="text-white/40 hover:text-white p-1 -m-1">
            <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsed preview — word + part of speech, then short meaning */}
      {!expanded && data && (
        <div className="flex flex-col gap-1">
          <p className="text-white text-base font-medium leading-tight">
            <span className="capitalize">{data.word}</span>
            {data.partOfSpeech && (
              <span className="text-violet-200/65 text-[11px] italic ml-2">{data.partOfSpeech}</span>
            )}
          </p>
          {data.meaning && (
            <p className="text-white/55 text-xs leading-snug line-clamp-2">{data.meaning}</p>
          )}
        </div>
      )}
      {!expanded && !data && error && (
        <p className="text-red-200/80 text-xs">{error}</p>
      )}

      {/* Expanded body */}
      {expanded && (
        <>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-400/20" onClick={stop}>
              <AlertCircle size={14} className="text-red-300 shrink-0" />
              <p className="text-red-200/90 text-xs leading-tight">{error}</p>
            </div>
          )}

          {loading && <Skeleton />}
          {!loading && !data && !error && <Skeleton />}

          {data && !loading && (
            <>
              <div
                className="relative flex-1 cursor-pointer"
                style={{ perspective: '1000px', minHeight: 100 }}
                onClick={(evt) => { evt.stopPropagation(); setFlipped((f) => !f); }}
              >
                <div
                  className="w-full h-full transition-all duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    minHeight: 100,
                  }}
                >
                  <div
                    className="absolute inset-0 flex flex-col justify-center items-center gap-1.5"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <p className="text-3xl font-semibold text-white capitalize tracking-tight">{data.word}</p>
                    {data.phonetic && <p className="text-white/55 text-sm font-mono">{data.phonetic}</p>}
                    <span className="text-[10px] text-violet-200/75 italic uppercase tracking-[0.18em] mt-0.5">{data.partOfSpeech}</span>
                    <p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.18em]">Tap to reveal</p>
                  </div>

                  <div
                    className="absolute inset-0 flex flex-col justify-center gap-2.5 rounded-xl bg-violet-500/10 border border-violet-300/15 px-3 py-3"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <p className="text-white/95 text-sm leading-relaxed">{data.meaning}</p>
                    {data.example && <p className="text-white/55 text-xs italic">"{data.example}"</p>}
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
        </>
      )}
    </div>
  );
}
