export interface WordEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  origin?: string;
}

export const WORDS: WordEntry[] = [
  { word: 'Serendipity', phonetic: '/ˌser.ənˈdɪp.ɪ.ti/', partOfSpeech: 'noun', meaning: 'The occurrence of happy events by chance', example: 'Finding that old photo was pure serendipity.', origin: 'Persian fairy tale' },
  { word: 'Ephemeral', phonetic: '/ɪˈfem.ər.əl/', partOfSpeech: 'adjective', meaning: 'Lasting for a very short time; transitory', example: 'The ephemeral beauty of cherry blossoms.', origin: 'Greek "ephemeros"' },
  { word: 'Luminous', phonetic: '/ˈluː.mɪ.nəs/', partOfSpeech: 'adjective', meaning: 'Full of or shedding light; bright or shining', example: 'The luminous stars lit the desert sky.', origin: 'Latin "luminosus"' },
  { word: 'Sonder', phonetic: '/ˈsɒn.dər/', partOfSpeech: 'noun', meaning: 'The realisation that each passerby has a vivid life as complex as your own', example: 'Walking through the city, he felt a deep sonder.', origin: 'Dictionary of Obscure Sorrows' },
  { word: 'Ineffable', phonetic: '/ɪˈnef.ə.bəl/', partOfSpeech: 'adjective', meaning: 'Too great or extreme to be expressed in words', example: 'She felt an ineffable sense of peace.', origin: 'Latin "ineffabilis"' },
  { word: 'Petrichor', phonetic: '/ˈpet.rɪ.kɔːr/', partOfSpeech: 'noun', meaning: 'The pleasant earthy smell after rain on dry ground', example: 'The petrichor after the storm was intoxicating.', origin: 'Greek "petra" (stone) + "ichor"' },
  { word: 'Halcyon', phonetic: '/ˈhæl.si.ən/', partOfSpeech: 'adjective', meaning: 'Denoting a period of time that was idyllically happy and peaceful', example: 'Those were halcyon days of childhood.', origin: 'Greek "alkyon" (kingfisher)' },
  { word: 'Mellifluous', phonetic: '/məˈlɪf.lu.əs/', partOfSpeech: 'adjective', meaning: 'Sweet or musical; pleasant to hear', example: 'Her mellifluous voice filled the room.', origin: 'Latin "mel" (honey)' },
  { word: 'Quixotic', phonetic: '/kwɪkˈsɒt.ɪk/', partOfSpeech: 'adjective', meaning: 'Exceedingly idealistic; unrealistic and impractical', example: 'His quixotic plan to sail solo around the world.', origin: 'Don Quixote by Cervantes' },
  { word: 'Hiraeth', phonetic: '/ˈhɪr.aɪθ/', partOfSpeech: 'noun', meaning: 'A longing for home or a sense of incompleteness', example: 'She felt a deep hiraeth for her homeland.', origin: 'Welsh' },
  { word: 'Solipsism', phonetic: '/ˈsɒl.ɪp.sɪ.z(ə)m/', partOfSpeech: 'noun', meaning: 'The view that only one\'s own mind is certain to exist', example: 'His solipsism made meaningful connection impossible.', origin: 'Latin "solus" (alone)' },
  { word: 'Crepuscular', phonetic: '/krɪˈpʌs.kjʊ.lər/', partOfSpeech: 'adjective', meaning: 'Of, resembling, or relating to twilight', example: 'Fireflies are crepuscular creatures.', origin: 'Latin "crepusculum" (twilight)' },
  { word: 'Vellichor', phonetic: '/ˈvel.ɪ.kɔːr/', partOfSpeech: 'noun', meaning: 'The strange wistfulness of used bookstores', example: 'She was lost in vellichor for hours among the shelves.', origin: 'Dictionary of Obscure Sorrows' },
  { word: 'Eunoia', phonetic: '/juːˈnɔɪ.ə/', partOfSpeech: 'noun', meaning: 'Beautiful thinking; a well-mind', example: 'He approached every disagreement with eunoia.', origin: 'Greek "eunoos" (well-minded)' },
  { word: 'Liminal', phonetic: '/ˈlɪm.ɪ.nəl/', partOfSpeech: 'adjective', meaning: 'Occupying a transitional or initial stage; a threshold', example: 'Airports have a liminal quality, between worlds.', origin: 'Latin "limen" (threshold)' },
  { word: 'Kairos', phonetic: '/ˈkaɪ.rɒs/', partOfSpeech: 'noun', meaning: 'A propitious moment for decisive action', example: 'She seized the kairos and delivered her speech.', origin: 'Ancient Greek' },
  { word: 'Numinous', phonetic: '/ˈnjuː.mɪ.nəs/', partOfSpeech: 'adjective', meaning: 'Having a strong spiritual or mysterious quality; evoking awe', example: 'The cathedral had a numinous atmosphere.', origin: 'Latin "numen" (divine power)' },
  { word: 'Sillage', phonetic: '/siˈjɑːʒ/', partOfSpeech: 'noun', meaning: 'The trail left by a fragrance in the air after someone passes', example: 'Her sillage lingered long after she left the room.', origin: 'French "sillage" (wake of a ship)' },
  { word: 'Enervate', phonetic: '/ˈen.ər.veɪt/', partOfSpeech: 'verb', meaning: 'To make someone feel drained of energy or vitality', example: 'The long meeting enervated everyone present.', origin: 'Latin "enervare"' },
  { word: 'Phosphene', phonetic: '/ˈfɒs.fiːn/', partOfSpeech: 'noun', meaning: 'The light you see when you close your eyes and press your eyelids', example: 'He saw dancing phosphenes in the darkness.', origin: 'Greek "phos" (light)' },
];

export function getWordOfDay(): WordEntry {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return WORDS[dayOfYear % WORDS.length];
}
