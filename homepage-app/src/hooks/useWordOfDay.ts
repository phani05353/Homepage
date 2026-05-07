import { useEffect, useState } from 'react';

export interface WordOfDay {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  origin?: string;
}

// All endpoints below send `Access-Control-Allow-Origin: *` — they work
// directly from the browser, no proxy required.
const DICT_URL  = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const CACHE_KEY = `hw_word_${new Date().toDateString()}`;

// Rotating Datamuse topics give us thematic-but-varied vocabulary each day
// without ever repeating the same fetch.
const TOPICS = [
  'wisdom',     'success',    'knowledge',   'curiosity',  'creativity',
  'philosophy', 'literature',  'language',    'art',        'history',
  'psychology', 'culture',    'innovation',  'leadership', 'discovery',
  'science',    'technology', 'beauty',      'reflection', 'understanding',
];

async function fetchCandidates(): Promise<string[]> {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const topic = TOPICS[dayIndex % TOPICS.length];
  const url = `https://api.datamuse.com/words?topics=${topic}&max=200`;

  const data: Array<{ word: string }> = await fetch(url).then((r) => r.json());

  // Filter for sophisticated single-token words (6+ chars, lowercase letters only)
  // and shuffle so the same topic still yields variety
  return data
    .map((w) => w.word)
    .filter((w) => w.length >= 6 && /^[a-z]+$/.test(w))
    .sort(() => Math.random() - 0.5)
    .slice(0, 30);
}

async function fetchDefinition(word: string): Promise<WordOfDay | null> {
  const res = await fetch(`${DICT_URL}${word}`);
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
  throw new Error('no word with definition found');
}

export function useWordOfDay() {
  const [data, setData]       = useState<WordOfDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

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
      const result = await findGoodWord();
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setData(result);
    } catch {
      setError('Live word lookup failed — refresh in a moment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, changeWord: () => load(true) };
}
