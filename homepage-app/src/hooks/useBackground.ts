import { useEffect, useState } from 'react';

export type Tint = [number, number, number];
const DEFAULT_TINT: Tint = [30, 35, 50];

// Sample the dominant non-grey colour from the image. Picsum sends
// `Access-Control-Allow-Origin: *`, so we can read pixels via canvas.
function extractDominantColor(img: HTMLImageElement): Tint | null {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  try {
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    type Bucket = { count: number; r: number; g: number; b: number };
    const buckets = new Map<string, Bucket>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // Skip near-black, near-white, and washed-out greys
      if (max < 40 || min > 215) continue;
      if (max - min < 14) continue;

      // Quantize to 24-step bins so similar shades merge
      const key = `${(r >> 4) << 4},${(g >> 4) << 4},${(b >> 4) << 4}`;
      const bucket = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
      bucket.count++;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      buckets.set(key, bucket);
    }

    let best: Bucket | null = null;
    for (const bucket of buckets.values()) {
      if (!best || bucket.count > best.count) best = bucket;
    }
    if (!best) return null;

    return [
      Math.round(best.r / best.count),
      Math.round(best.g / best.count),
      Math.round(best.b / best.count),
    ];
  } catch {
    return null;
  }
}

export function useBackground() {
  const dateStr = new Date().toISOString().slice(0, 10);
  const bg = `https://picsum.photos/seed/${dateStr}/1920/1080`;
  const [loaded, setLoaded] = useState(false);
  const [tint, setTint] = useState<Tint>(DEFAULT_TINT);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoaded(true);
      const sampled = extractDominantColor(img);
      if (sampled) setTint(sampled);
    };
    img.onerror = () => setLoaded(true);
    img.src = bg;
  }, [bg]);

  return { bg, loaded, tint };
}
