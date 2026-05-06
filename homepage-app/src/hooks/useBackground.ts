import { useEffect, useState } from 'react';
import { BACKGROUNDS } from '../config';

export function useBackground() {
  const [bg, setBg] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % BACKGROUNDS.length;
    const url = BACKGROUNDS[dayIndex];
    const img = new Image();
    img.onload = () => {
      setBg(url);
      setLoaded(true);
    };
    img.onerror = () => {
      // fallback: use next image
      const fallback = BACKGROUNDS[(dayIndex + 1) % BACKGROUNDS.length];
      setBg(fallback);
      setLoaded(true);
    };
    img.src = url;
  }, []);

  return { bg, loaded };
}
