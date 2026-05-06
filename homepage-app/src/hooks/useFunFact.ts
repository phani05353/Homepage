import { useEffect, useState } from 'react';

export interface DailyFact {
  text: string;
  sourceUrl?: string;
}

// Nginx proxies /proxy/facts/* → https://uselessfacts.jsph.pl/api/facts/*
// This avoids the browser CORS restriction entirely — Nginx fetches it server-side.
const PROXY_TODAY  = '/proxy/facts/today?language=en';
const PROXY_RANDOM = '/proxy/facts/random?language=en';

const FALLBACK: string[] = [
  "Honey never expires. Archaeologists found 3,000-year-old honey in Egyptian tombs — still perfectly edible.",
  "A group of flamingos is called a 'flamboyance'. They are literally named for being extra.",
  "The shortest war in history lasted 38–45 minutes — Britain vs Zanzibar in 1896.",
  "Otters hold hands while sleeping so they don't drift apart. This is called a 'raft'.",
  "There are more possible chess games than atoms in the observable universe.",
  "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
  "Bananas are technically berries, but strawberries are not. Botanists are trolling us.",
  "Oxford University is older than the Aztec Empire — founded around 1096 CE.",
  "A day on Venus is longer than a year on Venus. It spins that slowly.",
  "Sharks are older than trees. Sharks: 450M years. Trees: 350M years.",
  "The Eiffel Tower grows 15 cm taller in summer due to thermal expansion.",
  "Crows can recognise human faces and hold grudges for years. Do not mess with crows.",
  "There's a jellyfish (Turritopsis dohrnii) that is biologically immortal.",
  "The inventor of the Pringles can is buried in one. Fred Baur requested it.",
  "Wombats produce cube-shaped poop — the only animal known to do so.",
  "Nintendo was founded in 1889 as a playing card company.",
  "A 'jiffy' is an actual unit of time: 1/100th of a second in physics.",
  "The original name for Google was 'BackRub'. Dodged a bullet.",
  "The Hawaiian alphabet has only 13 letters.",
  "Sea otters have up to one million hairs per square inch — densest fur of any animal.",
  "The total weight of all ants on Earth roughly equals the weight of all humans.",
  "Maine is the closest US state to Africa. Most people guess Florida.",
  "Octopuses have three hearts, blue blood, and a brain in each arm.",
  "Hot water can freeze faster than cold water — the Mpemba effect.",
  "A bolt of lightning is five times hotter than the surface of the Sun.",
  "Finland has more saunas (3M) than cars (2.7M).",
  "Snails can sleep for up to 3 years.",
  "A group of owls is called a parliament.",
  "Butterflies taste with their feet.",
  "The average cloud weighs about 1.1 million pounds.",
  "Humans share 60% of their DNA with bananas.",
  "An octopus can unscrew a jar from the inside.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Penguins propose to each other with pebbles.",
  "Sloths can hold their breath longer than dolphins — up to 40 minutes.",
  "The word 'nerd' first appeared in Dr Seuss's 'If I Ran the Zoo' in 1950.",
  "Catfish have about 100,000 taste buds. Humans have around 10,000.",
  "Koalas have fingerprints virtually identical to humans.",
  "Astronauts grow up to 2 inches taller in space due to spinal decompression.",
  "The smell of rain has a name: petrichor.",
  "A group of rhinos is called a crash.",
  "Apples are 25% air, which is why they float.",
  "Polar bears have black skin under their white fur.",
  "The first webcam was invented to monitor a coffee pot at Cambridge University.",
  "A shrimp's heart is in its head.",
  "Elephants are the only animals that can't jump.",
  "A group of cats is called a clowder.",
  "Leeches have 32 brains.",
  "Cows produce more milk when listening to slow music.",
  "Seahorses are the only animal where the male gives birth.",
  "Figs contain dead wasps — wasps enter the fruit to lay eggs and can't escape.",
  "Rabbits cannot vomit.",
  "Giraffes have the same number of neck vertebrae as humans — seven.",
  "Scotland's national animal is the unicorn.",
  "The dot over the letter 'i' is called a tittle.",
  "Dogs have three eyelids.",
  "The planet Uranus was originally named 'Georgium Sidus' after King George III.",
  "Crocodiles cannot stick their tongues out.",
  "A group of jellyfish is called a 'smack'.",
  "A single strand of spaghetti is called a 'spaghetto'.",
  "Lobsters were once considered so cheap they were fed to prisoners.",
  "Tigers have striped skin, not just striped fur.",
  "Ants never sleep.",
  "The yo-yo was originally used as a weapon in the Philippines.",
  "The longest English word without a vowel is 'rhythms'.",
  "Pineapples take two years to grow.",
  "The moon is moving away from Earth at about 3.8 cm per year.",
  "Coca-Cola would be green if food colouring wasn't added.",
  "A sneeze travels at about 100 mph.",
  "The average person will spend 6 years of their life dreaming.",
  "Spiders can travel hundreds of miles by riding the wind on silk threads.",
  "Almonds are a member of the peach family.",
  "Pistachios are technically a fruit.",
  "Turtles can breathe through their butts — it's called cloacal respiration.",
];

const CACHE_KEY = `hw_fact_${new Date().toDateString()}`;

function fallbackByDay(): DailyFact {
  const idx = Math.floor(Date.now() / 86400000) % FALLBACK.length;
  return { text: FALLBACK[idx] };
}
function fallbackRandom(): DailyFact {
  return { text: FALLBACK[Math.floor(Math.random() * FALLBACK.length)] };
}

async function fetchProxy(random: boolean): Promise<DailyFact> {
  const res = await fetch(random ? PROXY_RANDOM : PROXY_TODAY, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error('proxy error');
  const data = await res.json();
  if (!data?.text) throw new Error('empty');
  return { text: data.text, sourceUrl: data.source_url };
}

export function useFunFact() {
  const [fact, setFact]     = useState<DailyFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive]   = useState(false);

  const load = async (random = false) => {
    setLoading(true);
    try {
      if (!random) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const p = JSON.parse(cached);
          setFact(p);
          setIsLive(!!p.sourceUrl);
          setLoading(false);
          return;
        }
      }

      try {
        const result = await fetchProxy(random);
        if (!random) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        setFact(result);
        setIsLive(true);
      } catch {
        // Nginx proxy unavailable (dev mode / no container) — use local list
        const result = random ? fallbackRandom() : fallbackByDay();
        if (!random) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        setFact(result);
        setIsLive(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { fact, loading, isLive, fetchAnother: () => load(true) };
}
