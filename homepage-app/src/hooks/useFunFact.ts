import { useEffect, useState } from 'react';

export interface DailyFact {
  text: string;
  sourceUrl?: string;
}

const CACHE_KEY = `hw_fact_${new Date().toDateString()}`;

async function fetchFromApi(random: boolean): Promise<DailyFact> {
  const url = random
    ? 'https://uselessfacts.jsph.pl/api/facts/random?language=en'
    : 'https://uselessfacts.jsph.pl/api/facts/today?language=en';
  const data = await fetch(url).then((r) => r.json());
  return { text: data.text, sourceUrl: data.source_url };
}

export function useFunFact() {
  const [fact, setFact] = useState<DailyFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (random = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!random) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setFact(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }
      const result = await fetchFromApi(random);
      if (!random) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setFact(result);
    } catch {
      setError('Could not fetch today\'s fact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { fact, loading, error, fetchAnother: () => load(true) };
}
