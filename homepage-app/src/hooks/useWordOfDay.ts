import { useEffect, useState } from 'react';

export interface WordOfDay {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  origin?: string;
}

const DICT_URL  = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const CACHE_KEY = `hw_word_${new Date().toDateString()}`;

// Datamuse seeds — rotated to keep results varied across days/clicks.
const SEED_TOPICS = [
  'wisdom', 'curiosity', 'creativity', 'philosophy', 'discovery',
  'knowledge', 'literature', 'art', 'science', 'culture',
];
const SEED_WORDS = [
  'intelligent', 'eloquent', 'pragmatic', 'thoughtful', 'meticulous',
  'curious', 'wise', 'discerning', 'astute', 'resilient',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchCandidates(): Promise<string[]> {
  // Pick a random Datamuse strategy each call so Change-word actually changes things.
  const strategies = [
    `topics=${pick(SEED_TOPICS)}`,
    `ml=${pick(SEED_WORDS)}`,
    `rel_syn=${pick(SEED_WORDS)}`,
  ];
  const url = `https://api.datamuse.com/words?${pick(strategies)}&max=200`;

  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Datamuse ${res.status}`);

  const data: Array<{ word: string }> = await res.json();
  const filtered = data
    .map((w) => w.word)
    .filter((w) => w.length >= 6 && /^[a-z]+$/.test(w))
    .sort(() => Math.random() - 0.5)
    .slice(0, 30);

  if (filtered.length === 0) throw new Error('Datamuse returned no usable words');
  return filtered;
}

async function fetchDefinition(word: string): Promise<WordOfDay | null> {
  const res = await fetch(`${DICT_URL}${word}`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return null;

  const defs = await res.json();
  if (!Array.isArray(defs) || !defs[0]) return null;

  const entry = defs[0];
  const meaning = entry.meanings?.[0];
  const def = meaning?.definitions?.[0];
  if (!meaning || !def) return null;

  return {
    word: entry.word,
    phonetic: entry.phonetic || entry.phonetics?.find((p: { text?: string }) => p.text)?.text || '',
    partOfSpeech: meaning.partOfSpeech,
    meaning: def.definition,
    example: def.example || '',
    origin: entry.origin || '',
  };
}

async function findGoodWord(): Promise<WordOfDay> {
  const candidates = await fetchCandidates();
  for (const word of candidates) {
    const result = await fetchDefinition(word);
    if (result) return result;
  }
  throw new Error('Dictionary lookup failed for all candidates');
}

export function useWordOfDay() {
  const [data, setData]       = useState<WordOfDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = async (fresh = false) => {
    setError(null);

    if (!fresh) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // bad cache, fall through to live fetch
        }
      }
    }

    setLoading(true);
    if (fresh) setData(null); // Clear so user sees skeleton while we fetch fresh

    try {
      const result = await findGoodWord();
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setData(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown error';
      setError(`Lookup failed: ${msg}`);
      // On a fresh-fetch failure, restore the previous cached word if any
      if (fresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try { setData(JSON.parse(cached)); } catch { /* ignore */ }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, changeWord: () => load(true) };
}
