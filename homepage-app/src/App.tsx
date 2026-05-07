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

  // Expose the sampled colour as a CSS variable so .glass / .glass-dark pick it up
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
        backgroundColor: '#0f0f1a',
      }}
    >
      {/* Darken overlay — uniform dim + soft top/bottom gradient for legibility */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-6">
        <WeatherBar />
        <SearchBar />
      </header>

      {/* Center — clock */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2 px-4 sm:px-8 py-8 sm:py-12">
        <Clock />
      </main>

      {/* Widget row */}
      <section className="relative z-10 px-4 sm:px-8 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <VocabWidget />
          <FunFactWidget />
          <QuoteWidget />
        </div>
      </section>
    </div>
  );
}
