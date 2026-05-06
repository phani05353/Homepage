import { useEffect, useState } from 'react';

export interface WordOfDay {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  origin?: string;
}

const CACHE_KEY = `hw_word_${new Date().toDateString()}`;
const DICT_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const WORD_API = 'https://random-word-api.vercel.app/api?words=20';

async function findValidWord(): Promise<WordOfDay> {
  const words: string[] = await fetch(WORD_API).then((r) => r.json());

  for (const word of words) {
    try {
      const defs = await fetch(`${DICT_URL}${word}`).then((r) => r.json());
      if (!Array.isArray(defs) || !defs[0]) continue;

      const entry = defs[0];
      const meaning = entry.meanings?.[0];
      const def = meaning?.definitions?.[0];
      if (!meaning || !def) continue;

      return {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.find((p: { text?: string }) => p.text)?.text || '',
        partOfSpeech: meaning.partOfSpeech,
        meaning: def.definition,
        example: def.example || '',
        origin: entry.origin || '',
      };
    } catch {
      continue;
    }
  }
  throw new Error('No valid word found');
}

export function useWordOfDay() {
  const [data, setData] = useState<WordOfDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (fresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!fresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }
      const result = await findValidWord();
      if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setData(result);
    } catch {
      setError('Could not fetch word of the day');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, refresh: () => load(true) };
}
