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
  // Try multiple strategies in sequence — return as soon as one yields words.
  // Order is randomised so Change-word actually changes things.
  const strategies = [
    `topics=${pick(SEED_TOPICS)}`,
    `ml=${pick(SEED_WORDS)}`,
    `rel_syn=${pick(SEED_WORDS)}`,
    `topics=${pick(SEED_TOPICS)}`,
    `ml=intelligent`, // fallback known-good
  ].sort(() => Math.random() - 0.5);

  for (const strategy of strategies) {
    try {
      const url = `https://api.datamuse.com/words?${strategy}&max=200`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;

      const data: Array<{ word: string }> = await res.json();
      const filtered = data
        .map((w) => w.word)
        .filter((w) => w.length >= 5 && /^[a-z]+$/.test(w))
        .sort(() => Math.random() - 0.5)
        .slice(0, 40);

      if (filtered.length >= 5) return filtered;
    } catch {
      // try next strategy
    }
  }

  throw new Error('Datamuse returned no usable words across all strategies');
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
