import { useState } from 'react';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
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
  const { data, loading, error } = useWordOfDay();
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="glass-dark rounded-3xl p-5 widget-shadow flex flex-col gap-4 min-h-[220px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-violet-300" />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Word of the Day</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full">
          <Sparkles size={10} />
          Live
        </span>
      </div>

      {loading && <Skeleton />}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-white/40">
          <AlertCircle size={20} />
          <p className="text-xs text-center">{error}</p>
        </div>
      )}

      {data && !loading && (
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
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col justify-center items-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-4"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-2xl font-semibold text-white capitalize">{data.word}</p>
              {data.phonetic && <p className="text-white/50 text-sm font-mono">{data.phonetic}</p>}
              <span className="text-xs text-violet-300/70 italic">{data.partOfSpeech}</span>
              <p className="text-white/25 text-xs mt-2">Tap to reveal meaning</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col justify-center gap-3 rounded-2xl bg-violet-900/30 border border-violet-500/20 p-4"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="text-white text-sm leading-relaxed">{data.meaning}</p>
              {data.example && (
                <p className="text-white/50 text-xs italic">"{data.example}"</p>
              )}
              {data.origin && (
                <p className="text-violet-300/60 text-xs">Origin: {data.origin}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
