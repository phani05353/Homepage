import { useBackground } from './hooks/useBackground';
import Clock from './components/Clock';
import WeatherBar from './components/WeatherBar';
import SearchBar from './components/SearchBar';
import VocabWidget from './components/widgets/VocabWidget';
import FunFactWidget from './components/widgets/FunFactWidget';
import QuoteWidget from './components/widgets/QuoteWidget';

export default function App() {
  const { bg, loaded } = useBackground();

  return (
    <div
      className="min-h-screen w-full relative flex flex-col transition-opacity duration-1000"
      style={{
        opacity: loaded ? 1 : 0,
        backgroundImage: bg ? `url(${bg})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f0f1a',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-6">
        <WeatherBar />
        <SearchBar />
      </header>

      {/* Center — clock */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2 px-8 pb-8">
        <Clock />
      </main>

      {/* Widget row */}
      <section className="relative z-10 px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <VocabWidget />
          <FunFactWidget />
          <QuoteWidget />
        </div>
      </section>
    </div>
  );
}
