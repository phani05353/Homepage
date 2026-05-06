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
  const ss = time.getSeconds().toString().padStart(2, '0');
  const { text: greeting, emoji } = getGreeting(h);

  const date = time.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="select-none flex flex-col items-center" style={{ gap: '0.6rem' }}>

      {/* Greeting pill */}
      <p className="text-white/45 text-xs font-medium tracking-[0.5em] uppercase">
        {emoji} &nbsp;{greeting}
      </p>

      {/* Time */}
      <div className="flex items-baseline" style={{ gap: 0 }}>
        {/* Hours */}
        <span
          className="font-thin text-white tabular-nums"
          style={{
            fontSize: 'clamp(4.5rem, 15vw, 9rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 40px rgba(0,0,0,0.55)',
          }}
        >
          {hh}
        </span>

        {/* Blinking colon */}
        <span
          className="font-thin text-white tabular-nums"
          style={{
            fontSize: 'clamp(4rem, 13vw, 8rem)',
            lineHeight: 1,
            letterSpacing: 0,
            opacity: blink ? 1 : 0.18,
            transition: 'opacity 0.1s',
            textShadow: '0 2px 40px rgba(0,0,0,0.55)',
            padding: '0 0.15em',
          }}
        >
          :
        </span>

        {/* Minutes */}
        <span
          className="font-thin text-white tabular-nums"
          style={{
            fontSize: 'clamp(4.5rem, 15vw, 9rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 40px rgba(0,0,0,0.55)',
          }}
        >
          {mm}
        </span>

        {/* Seconds — superscript style */}
        <span
          className="font-light text-white/35 tabular-nums"
          style={{
            fontSize: 'clamp(1.1rem, 2.8vw, 1.9rem)',
            lineHeight: 1,
            alignSelf: 'flex-start',
            marginTop: '0.5em',
            marginLeft: '0.35em',
          }}
        >
          {ss}
        </span>
      </div>

      {/* Date */}
      <p
        className="font-light text-white/45 uppercase tracking-widest"
        style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.78rem)', letterSpacing: '0.22em' }}
      >
        {date}
      </p>

    </div>
  );
}
