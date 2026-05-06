export interface Fact {
  fact: string;
  category: string;
  emoji: string;
}

export const FACTS: Fact[] = [
  { fact: 'Honey never expires. Archaeologists found 3,000-year-old honey in Egyptian tombs — still perfectly edible.', category: 'Food', emoji: '🍯' },
  { fact: 'A group of flamingos is called a "flamboyance." They are literally named for being extra.', category: 'Animals', emoji: '🦩' },
  { fact: 'The shortest war in history lasted 38–45 minutes — Britain vs Zanzibar in 1896.', category: 'History', emoji: '⚔️' },
  { fact: 'Otters hold hands while sleeping so they don\'t drift apart. This is called a "raft."', category: 'Animals', emoji: '🦦' },
  { fact: 'There are more possible chess games than atoms in the observable universe.', category: 'Science', emoji: '♟️' },
  { fact: 'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.', category: 'History', emoji: '🏺' },
  { fact: 'Bananas are technically berries, but strawberries are not. Botanists are trolling us.', category: 'Science', emoji: '🍌' },
  { fact: 'The blob of toothpaste on a toothbrush is called a "nurdle." You\'re welcome.', category: 'Language', emoji: '🪥' },
  { fact: 'Oxford University is older than the Aztec Empire. It was founded around 1096 CE.', category: 'History', emoji: '🎓' },
  { fact: 'A day on Venus is longer than a year on Venus. It spins that slowly.', category: 'Space', emoji: '🪐' },
  { fact: 'Sharks are older than trees. Sharks: 450M years. Trees: 350M years.', category: 'Science', emoji: '🦈' },
  { fact: 'The Eiffel Tower grows 15 cm taller in summer due to thermal expansion of the iron.', category: 'Engineering', emoji: '🗼' },
  { fact: 'Crows can recognise human faces and hold grudges for years. Do not mess with crows.', category: 'Animals', emoji: '🐦‍⬛' },
  { fact: 'There\'s a species of jellyfish (Turritopsis dohrnii) that is biologically immortal.', category: 'Science', emoji: '🪼' },
  { fact: 'The inventor of the Pringles can is buried in one. Fred Baur requested it.', category: 'History', emoji: '🥫' },
  { fact: 'Wombats produce cube-shaped poop — the only animal known to do so. Physics is wild.', category: 'Animals', emoji: '🐨' },
  { fact: 'Nintendo was founded in 1889, originally as a playing card company.', category: 'Tech', emoji: '🎮' },
  { fact: 'A "jiffy" is an actual unit of time: 1/100th of a second in physics.', category: 'Science', emoji: '⚡' },
  { fact: 'The original name for the search engine Google was "BackRub." Dodged a bullet.', category: 'Tech', emoji: '🔍' },
  { fact: 'Cats are responsible for wiping out 33 bird species globally. They are merciless hunters.', category: 'Animals', emoji: '🐈' },
  { fact: 'The Hawaiian alphabet has only 13 letters. Minimum viable alphabet.', category: 'Language', emoji: '🌺' },
  { fact: 'Sea otters have the densest fur of any animal — up to one million hairs per square inch.', category: 'Animals', emoji: '🦦' },
  { fact: 'The total weight of all ants on Earth roughly equals the weight of all humans.', category: 'Science', emoji: '🐜' },
  { fact: 'There are more stars in the universe than grains of sand on all Earth\'s beaches.', category: 'Space', emoji: '⭐' },
  { fact: 'Maine is the closest US state to Africa. Most people guess Florida.', category: 'Geography', emoji: '🗺️' },
  { fact: 'The letter "e" appears over 6,000 times in a typical novel. You barely notice.', category: 'Language', emoji: '📚' },
  { fact: 'Octopuses have three hearts, blue blood, and eight brains (one per arm). They are alien.', category: 'Animals', emoji: '🐙' },
  { fact: 'Hot water freezes faster than cold water under certain conditions. This is the Mpemba effect.', category: 'Science', emoji: '🧊' },
  { fact: 'A bolt of lightning is five times hotter than the surface of the Sun.', category: 'Science', emoji: '⚡' },
  { fact: 'Finland has more saunas (3M) than cars (2.7M). Priorities in order.', category: 'Geography', emoji: '🧖' },
];

export function getFactOfDay(): Fact {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return FACTS[dayOfYear % FACTS.length];
}
