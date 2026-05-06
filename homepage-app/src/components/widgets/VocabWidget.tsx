import { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { WORDS, getWordOfDay } from '../../data/vocabulary';

export default function VocabWidget() {
  const todayIndex = WORDS.indexOf(getWordOfDay());
  const [index, setIndex] = useState(todayIndex);
  const [flipped, setFlipped] = useState(false);

  const word = WORDS[index];
  const isToday = index === todayIndex;

  const prev = () => { setIndex((i) => (i - 1 + WORDS.length) % WORDS.length); setFlipped(false); };
  const next = () => { setIndex((i) => (i + 1) % WORDS.length); setFlipped(false); };

  return (
    <div className="glass-dark rounded-3xl p-5 widget-shadow flex flex-col gap-4 min-h-[200px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-violet-300" />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Vocabulary</span>
        </div>
        {isToday && (
          <span className="flex items-center gap-1 text-xs text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full">
            <Sparkles size={10} />
            Today's word
          </span>
        )}
      </div>

      {/* Flash card */}
      <div
        className="relative flex-1 cursor-pointer"
        style={{ perspective: '1000px', minHeight: 120 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="w-full h-full transition-all duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: 120,
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-4"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-2xl font-semibold text-white">{word.word}</p>
            <p className="text-white/50 text-sm font-mono">{word.phonetic}</p>
            <span className="text-xs text-violet-300/70 mt-1 italic">{word.partOfSpeech}</span>
            <p className="text-white/30 text-xs mt-2">Tap to reveal meaning</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col justify-center gap-3 rounded-2xl bg-violet-900/30 border border-violet-500/20 p-4"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-white text-sm leading-relaxed">{word.meaning}</p>
            <p className="text-white/50 text-xs italic">"{word.example}"</p>
            {word.origin && (
              <p className="text-violet-300/60 text-xs">Origin: {word.origin}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} className="text-white/40 hover:text-white transition-colors p-1">
          <ChevronLeft size={16} />
        </button>
        <p className="text-white/30 text-xs">{index + 1} / {WORDS.length}</p>
        <button onClick={next} className="text-white/40 hover:text-white transition-colors p-1">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
