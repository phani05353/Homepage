import { useEffect, useState } from 'react';

function getGreeting(hours: number) {
  if (hours < 5)  return { text: 'Good Night',      emoji: '🌙' };
  if (hours < 12) return { text: 'Good Morning',    emoji: '🌅' };
  if (hours < 17) return { text: 'Good Afternoon',  emoji: '☀️' };
  if (hours < 21) return { text: 'Good Evening',    emoji: '🌆' };
  return            { text: 'Good Night',            emoji: '🌙' };
}

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
      setColonVisible((v) => !v);
    }, 500);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const hh = h.toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const { text: greeting, emoji } = getGreeting(h);

  const date = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="select-none flex flex-col items-center gap-4">
      {/* Greeting */}
      <p className="text-white/50 text-base font-light tracking-[0.4em] uppercase">
        {emoji}&nbsp; {greeting}
      </p>

      {/* Main clock face */}
      <div className="flex items-center leading-none">
        <span
          className="font-extralight text-white"
          style={{
            fontSize: 'clamp(5rem, 18vw, 11rem)',
            letterSpacing: '-0.04em',
            textShadow: '0 0 80px rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {hh}
        </span>

        <span
          className="font-extralight text-white transition-opacity duration-75 mx-1"
          style={{
            fontSize: 'clamp(4rem, 14vw, 9rem)',
            opacity: colonVisible ? 0.9 : 0.15,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          :
        </span>

        <span
          className="font-extralight text-white"
          style={{
            fontSize: 'clamp(5rem, 18vw, 11rem)',
            letterSpacing: '-0.04em',
            textShadow: '0 0 80px rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {mm}
        </span>

        {/* Seconds — smaller, bottom-aligned */}
        <span
          className="font-light text-white/40 self-end mb-3 ml-2"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          {ss}
        </span>
      </div>

      {/* Date */}
      <p className="text-white/55 text-sm font-light tracking-[0.25em] uppercase">
        {date}
      </p>
    </div>
  );
}
