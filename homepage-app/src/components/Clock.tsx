import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="select-none">
      <div className="flex items-end gap-1">
        <span className="text-8xl font-thin text-white text-shadow tracking-tighter">
          {hours}:{minutes}
        </span>
        <span className="text-3xl font-thin text-white/70 mb-3 text-shadow">
          {seconds}
        </span>
      </div>
      <p className="text-xl font-light text-white/80 text-shadow tracking-wider mt-1">{date}</p>
    </div>
  );
}
