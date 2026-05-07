import type { CSSProperties } from 'react';
import { useBackground } from './hooks/useBackground';
import Clock from './components/Clock';
import WeatherBar from './components/WeatherBar';
import SearchBar from './components/SearchBar';
import VocabWidget from './components/widgets/VocabWidget';
import FunFactWidget from './components/widgets/FunFactWidget';
import QuoteWidget from './components/widgets/QuoteWidget';

export default function App() {
  const { bg, loaded, tint } = useBackground();

  const tintStyle = { '--tint': tint.join(' ') } as CSSProperties;

  return (
    <div
      className="min-h-screen w-full relative flex flex-col transition-opacity duration-1000"
      style={{
        ...tintStyle,
        opacity: loaded ? 1 : 0,
        backgroundImage: bg ? `url(${bg})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0e0f15',
      }}
    >
      {/* Layer 1 — uniform dim for legibility */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      {/* Layer 2 — vertical gradient (top/bottom darker than middle) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 pointer-events-none" />
      {/* Layer 3 — soft radial vignette for ambient corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 75% at center 45%, transparent 0%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-6">
        <WeatherBar />
        <SearchBar />
      </header>

      {/* Center — clock */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2 px-4 sm:px-8 py-8 sm:py-12">
        <Clock />
      </main>

      {/* Widget row — staggered entrance, all cards stretched to equal height */}
      <section className="relative z-10 px-4 sm:px-8 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto items-stretch">
          <div className="rise-in h-full" style={{ animationDelay: '0ms' }}><VocabWidget /></div>
          <div className="rise-in h-full" style={{ animationDelay: '120ms' }}><FunFactWidget /></div>
          <div className="rise-in h-full" style={{ animationDelay: '240ms' }}><QuoteWidget /></div>
        </div>
      </section>
    </div>
  );
}
