import { useEffect, useState } from 'react';

export interface DailyFact {
  text: string;
  sourceUrl?: string;
}

// ── Fallback facts (used if the live API is blocked / unreachable) ──────────
const FALLBACK_FACTS: string[] = [
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
  "A group of pugs is called a 'grumble'.",
  "Sloths can hold their breath longer than dolphins — up to 40 minutes.",
  "Pistachios are technically a fruit.",
  "Turtles can breathe through their butts — it's called cloacal respiration.",
  "The word 'nerd' was first used in Dr Seuss's 'If I Ran the Zoo' in 1950.",
  "The shortest place name on Earth is 'Å' — a village in Norway.",
  "Catfish have about 100,000 taste buds — humans have around 10,000.",
  "A group of porcupines is called a prickle.",
  "The inventor of the chocolate chip cookie sold the idea to Nestlé for a lifetime supply of chocolate.",
  "It takes glass about one million years to fully decompose.",
  "Koalas have fingerprints virtually identical to humans.",
  "The Sahara Desert was once a lush savannah — about 10,000 years ago.",
  "A day on Mercury lasts longer than a year on Mercury.",
  "Astronauts grow up to 2 inches taller in space.",
  "The smell of rain has a name: petrichor.",
  "A group of rhinos is called a crash.",
  "There are more fake flamingos in the world than real ones.",
  "Spiders can't fly — but they can travel hundreds of miles by riding the wind on silk threads.",
  "Apples are 25% air, which is why they float.",
  "The average person walks 100,000 miles in a lifetime — about 4 times around the Earth.",
  "Polar bears have black skin under their white fur.",
  "The first webcam was invented to monitor a coffee pot at Cambridge University.",
  "Almonds are a member of the peach family.",
  "A shrimp's heart is in its head.",
  "Elephants are the only animals that can't jump.",
  "The Twitter bird's official name is Larry, after Larry Bird of the Boston Celtics.",
  "A group of cats is called a clowder.",
  "You can't hum while holding your nose closed.",
  "More people are killed each year by vending machines than by sharks.",
  "Leeches have 32 brains.",
  "The Milky Way smells like rum and tastes of raspberries, according to astronomers.",
  "The founder of Match.com lost his girlfriend to a man she met on Match.com.",
  "Cows produce more milk when listening to slow music.",
  "Seahorses are the only animal where the male gives birth.",
  "The Bermuda Triangle contains no more shipwrecks than any other region of the ocean.",
  "The word 'sandwich' is named after the Earl of Sandwich, who ate meat between bread so he could keep gambling.",
  "There are more possible sudoku puzzles than atoms on Earth.",
  "Figs contain dead wasps — they enter the fruit to lay eggs and can't escape.",
  "Rabbits cannot vomit.",
  "Paper was invented in China in 105 AD — roughly 1,400 years before it reached Europe.",
  "The average person spends 6 months of their lifetime waiting for a red light.",
  "Giraffes have the same number of neck vertebrae as humans — seven.",
  "Scotland's national animal is the unicorn.",
  "South Korea has a museum dedicated entirely to toilets.",
  "The dot over the letter 'i' is called a tittle.",
  "Dogs have three eyelids.",
  "The longest English word without a vowel is 'rhythms'.",
  "Every 'odd' number has the letter 'e' in it when written out.",
  "Pogonophobia is the fear of beards.",
  "The planet Uranus was originally named 'Georgium Sidus' after King George III.",
  "Chameleons don't actually change colour to camouflage — they do it to communicate.",
  "Crocodiles cannot stick their tongues out.",
  "A group of jellyfish is called a 'smack'.",
  "The human nose can detect over 1 trillion different scents.",
  "The original purpose of bubble wrap was to be used as wallpaper.",
  "A single strand of spaghetti is called a 'spaghetto'.",
  "Lobsters were once considered so cheap they were fed to prisoners.",
  "The world's oldest piece of chewing gum is over 9,000 years old.",
  "The longest time between two twins being born is 87 days.",
  "Tigers have striped skin, not just striped fur.",
  "Ants never sleep.",
  "Waking up takes 40 muscles — smiling takes 17.",
  "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
  "The yo-yo was originally used as a weapon in the Philippines.",
];

const CACHE_KEY = `hw_fact_${new Date().toDateString()}`;

function getFallbackFact(): DailyFact {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return { text: FALLBACK_FACTS[dayIndex % FALLBACK_FACTS.length] };
}

function getRandomFallback(): DailyFact {
  return { text: FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)] };
}

async function fetchLiveFact(random: boolean): Promise<DailyFact> {
  const url = random
    ? 'https://uselessfacts.jsph.pl/api/facts/random?language=en'
    : 'https://uselessfacts.jsph.pl/api/facts/today?language=en';
  const data = await fetch(url, { signal: AbortSignal.timeout(4000) }).then((r) => r.json());
  if (!data?.text) throw new Error('empty');
  return { text: data.text, sourceUrl: data.source_url };
}

export function useFunFact() {
  const [fact, setFact] = useState<DailyFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const load = async (random = false) => {
    setLoading(true);
    try {
      if (!random) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setFact(parsed);
          setIsLive(!!parsed.sourceUrl);
          setLoading(false);
          return;
        }
      }

      // Try live API; fall back silently to local list
      try {
        const result = await fetchLiveFact(random);
        if (!random) localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        setFact(result);
        setIsLive(true);
      } catch {
        const result = random ? getRandomFallback() : getFallbackFact();
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
