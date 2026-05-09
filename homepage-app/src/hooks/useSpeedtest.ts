import { useEffect, useRef, useState } from 'react';
import SpeedTest from '@cloudflare/speedtest';

export interface SpeedtestResult {
  download: number;     // Mbps
  upload: number;       // Mbps
  latency: number;      // ms
  jitter: number;       // ms
  packetLoss: number;   // %
  timestamp: number;    // epoch ms
}

const CACHE_KEY = 'hw_speedtest';
const STALE_MS  = 5 * 60 * 1000; // auto-run if last result is older than 5 minutes

function loadCached(): SpeedtestResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useSpeedtest() {
  const [result, setResult]     = useState<SpeedtestResult | null>(loadCached);
  const [running, setRunning]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [progress, setProgress] = useState<Partial<SpeedtestResult>>({});

  const engineRef = useRef<SpeedTest | null>(null);

  const start = () => {
    if (engineRef.current) return; // a test is already in flight

    setError(null);
    setProgress({});
    setRunning(true);

    const engine = new SpeedTest({ autoStart: false });
    engineRef.current = engine;

    engine.onResultsChange = () => {
      const s = engine.results.getSummary();
      // Library types say `number | undefined` but it sometimes returns null.
      // Normalise to undefined so render-time formatters stay happy.
      const num = (v: number | null | undefined): number | undefined =>
        typeof v === 'number' ? v : undefined;
      setProgress({
        download:   num(s.download)   !== undefined ? (s.download   as number) / 1e6 : undefined,
        upload:     num(s.upload)     !== undefined ? (s.upload     as number) / 1e6 : undefined,
        latency:    num(s.latency),
        jitter:     num(s.jitter),
        packetLoss: num(s.packetLoss) !== undefined ? (s.packetLoss as number) * 100 : undefined,
      });
    };

    engine.onFinish = (results) => {
      const s = results.getSummary();
      const safe = (v: number | null | undefined): number => (typeof v === 'number' ? v : 0);
      const final: SpeedtestResult = {
        download:   safe(s.download)   / 1e6,
        upload:     safe(s.upload)     / 1e6,
        latency:    safe(s.latency),
        jitter:     safe(s.jitter),
        packetLoss: safe(s.packetLoss) * 100,
        timestamp:  Date.now(),
      };
      setResult(final);
      setProgress({});
      setRunning(false);
      engineRef.current = null;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(final)); } catch { /* ignore */ }
    };

    engine.onError = (e) => {
      setError(typeof e === 'string' ? e : 'Speedtest failed');
      setRunning(false);
      setProgress({});
      engineRef.current = null;
    };

    engine.play();
  };

  const stop = () => {
    try { engineRef.current?.pause(); } catch { /* ignore */ }
    engineRef.current = null;
    setRunning(false);
    setProgress({});
  };

  // On mount: auto-run if there's no cached result OR it's older than 5 minutes.
  // 200ms timeout safely absorbs React StrictMode's dev-only double-mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      const cached = loadCached();
      if (!cached || Date.now() - cached.timestamp > STALE_MS) {
        start();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      try { engineRef.current?.pause(); } catch { /* ignore */ }
      engineRef.current = null;
    };
  }, []);

  return { result, running, error, progress, start, stop };
}
