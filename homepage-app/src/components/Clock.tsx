import { useEffect, useState } from 'react';

function getGreeting(h: number) {
  if (h < 5)  return { text: 'Good Night',     emoji: '🌙' };
  if (h < 12) return { text: 'Good Morning',   emoji: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (h < 21) return { text: 'Good Evening',   emoji: '🌆' };
  return        { text: 'Good Night',          emoji: '🌙' };
}

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const hh = h.toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const { text: greeting, emoji } = getGreeting(h);
  const date = time.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div className="select-none flex flex-col items-center gap-4 sm:gap-5">
      {/* Greeting */}
      <p className="text-white/60 text-xs sm:text-sm font-medium tracking-[0.4em] uppercase">
        {emoji}&nbsp;&nbsp;{greeting}
      </p>

      {/* Time — single string, proper colon, light weight */}
      <div
        className="text-white"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif',
          fontSize: 'clamp(5rem, 16vw, 10rem)',
          fontWeight: 300,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          textShadow: '0 4px 30px rgba(0,0,0,0.55), 0 0 80px rgba(0,0,0,0.2)',
        }}
      >
        {hh}:{mm}
      </div>

      {/* Date */}
      <p
        className="font-light text-white/55 uppercase"
        style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', letterSpacing: '0.3em' }}
      >
        {date}
      </p>
    </div>
  );
}
