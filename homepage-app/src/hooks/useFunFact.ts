import { useEffect, useState } from 'react';

export interface DailyFact {
  text: string;
}

// uselessfacts /api/v2/* endpoints DO send CORS headers (unlike the v1 /api/*
// endpoints, which don't). This works directly from the browser.
const FACT_URL  = 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en';
const CACHE_KEY = `hw_fact_${new Date().toDateString()}`;

async function fetchFact(): Promise<DailyFact> {
  const res = await fetch(FACT_URL);
  if (!res.ok) throw new Error('fact api error');
  const data = await res.json();
  if (!data?.text) throw new Error('empty');
  return { text: data.text };
}

export function useFunFact() {
  const [fact, setFact]       = useState<DailyFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = async (fresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!fresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setFact(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }
      const result = await fetchFact();
      if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setFact(result);
    } catch {
      setError('Live fact unavailable — refresh in a moment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { fact, loading, error, fetchAnother: () => load(true) };
}
