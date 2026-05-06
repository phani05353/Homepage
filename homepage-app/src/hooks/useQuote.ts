import { useEffect, useState } from 'react';

export interface DailyQuote {
  text: string;
  author: string;
}

const CACHE_KEY = `hw_quote_${new Date().toDateString()}`;

async function fetchFromApi(): Promise<DailyQuote> {
  const data = await fetch('https://dummyjson.com/quotes/random').then((r) => r.json());
  return { text: data.quote, author: data.author };
}

export function useQuote() {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (fresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!fresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setQuote(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }
      const result = await fetchFromApi();
      if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setQuote(result);
    } catch {
      setError('Could not fetch quote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { quote, loading, error, fetchNew: () => load(true) };
}
