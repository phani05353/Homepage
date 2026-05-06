import { useEffect, useState } from 'react';
import { getTodayWord, WORD_LIST } from '../data/wordlist';

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

async function fetchDefinition(word: string): Promise<WordOfDay> {
  const defs = await fetch(`${DICT_URL}${word}`).then((r) => r.json());
  if (!Array.isArray(defs) || !defs[0]) throw new Error('no entry');

  const entry = defs[0];
  const meaning = entry.meanings?.[0];
  const def = meaning?.definitions?.[0];
  if (!meaning || !def) throw new Error('no definition');

  return {
    word: entry.word,
    phonetic: entry.phonetic || entry.phonetics?.find((p: { text?: string }) => p.text)?.text || '',
    partOfSpeech: meaning.partOfSpeech,
    meaning: def.definition,
    example: def.example || '',
    origin: entry.origin || '',
  };
}

async function findValidWord(startWord?: string): Promise<WordOfDay> {
  const dayIndex = Math.floor(Date.now() / 86400000);
  // Try today's word first, then walk forward through the list until one resolves
  const candidates = startWord
    ? [startWord]
    : Array.from({ length: 5 }, (_, i) => WORD_LIST[(dayIndex + i) % WORD_LIST.length]);

  for (const word of candidates) {
    try {
      return await fetchDefinition(word);
    } catch {
      continue;
    }
  }
  throw new Error('no valid word');
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
      const word = fresh ? undefined : getTodayWord();
      const result = await findValidWord(word);
      if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setData(result);
    } catch {
      setError('Definition unavailable — try again later');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, refresh: () => load(true) };
}
