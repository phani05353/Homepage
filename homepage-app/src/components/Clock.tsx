import { useEffect, useState } from 'react';

function getGreeting(h: number) {
  if (h < 5)  return { text: 'Good Night',     emoji: '🌙' };
  if (h < 12) return { text: 'Good Morning',   emoji: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (h < 21) return { text: 'Good Evening',   emoji: '🌆' };
  return        { text: 'Good Night',          emoji: '🌙' };
}

export default function Clock() {
  const [time, setTime]   = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
      setBlink((b) => !b);
    }, 500);
    return () => clearInterval(id);
  }, []);

  const h  = time.getHours();
  const hh = h.toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const { text: greeting, emoji } = getGreeting(h);
  const date = time.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  // Single source of truth for the digit size so the dot separator scales with it
  const digitSize = 'clamp(5rem, 15vw, 9.5rem)';
  const digitShadow = '0 4px 32px rgba(0,0,0,0.45), 0 0 60px rgba(0,0,0,0.25)';

  return (
    <div className="select-none flex flex-col items-center gap-4 sm:gap-6">
      {/* Greeting */}
      <p className="text-white/60 text-xs sm:text-sm font-medium tracking-[0.45em] uppercase">
        {emoji}&nbsp;&nbsp;{greeting}
      </p>

      {/* Time row */}
      <div className="flex items-center gap-3 sm:gap-5">
        <span
          className="font-extralight text-white tabular-nums leading-none"
          style={{ fontSize: digitSize, letterSpacing: '-0.04em', textShadow: digitShadow }}
        >
          {hh}
        </span>

        {/* Two-dot separator — scales with digit size, blinks together */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ height: digitSize, gap: '0.45em', fontSize: digitSize }}
        >
          <span
            className="block bg-white rounded-full"
            style={{
              width: '0.16em',
              height: '0.16em',
              opacity: blink ? 0.95 : 0.18,
              transition: 'opacity 0.15s ease-out',
              boxShadow: '0 0 24px rgba(255,255,255,0.35)',
            }}
          />
          <span
            className="block bg-white rounded-full"
            style={{
              width: '0.16em',
              height: '0.16em',
              opacity: blink ? 0.95 : 0.18,
              transition: 'opacity 0.15s ease-out',
              boxShadow: '0 0 24px rgba(255,255,255,0.35)',
            }}
          />
        </div>

        <span
          className="font-extralight text-white tabular-nums leading-none"
          style={{ fontSize: digitSize, letterSpacing: '-0.04em', textShadow: digitShadow }}
        >
          {mm}
        </span>
      </div>

      {/* Date */}
      <p
        className="font-light text-white/55 uppercase"
        style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.82rem)', letterSpacing: '0.32em' }}
      >
        {date}
      </p>
    </div>
  );
}
