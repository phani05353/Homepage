import { useEffect, useState } from 'react';

export function useBackground() {
  // Date-seeded so it changes daily and is consistent within a day.
  // Picsum serves curated Unsplash-quality landscape photos.
  const dateStr = new Date().toISOString().slice(0, 10);
  const bg = `https://picsum.photos/seed/${dateStr}/1920/1080`;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    img.src = bg;
  }, [bg]);

  return { bg, loaded };
}
