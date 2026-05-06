import { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const QUOTES = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', author: 'Aristotle' },
  { text: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', author: 'Einstein' },
  { text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Emerson' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
  { text: 'Whether you think you can or you think you can\'t, you\'re right.', author: 'Henry Ford' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'An unexamined life is not worth living.', author: 'Socrates' },
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
  { text: 'Not everything that can be counted counts, and not everything that counts can be counted.', author: 'Albert Einstein' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', author: 'Mother Teresa' },
  { text: 'When you reach the end of your rope, tie a knot in it and hang on.', author: 'Franklin D. Roosevelt' },
  { text: 'Always remember that you are absolutely unique. Just like everyone else.', author: 'Margaret Mead' },
];

function getDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}

export default function QuoteWidget() {
  const [quote, setQuote] = useState(getDailyQuote);
  const [spinning, setSpinning] = useState(false);

  const shuffle = () => {
    setSpinning(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setTimeout(() => setSpinning(false), 400);
  };

  return (
    <div className="glass-dark rounded-3xl p-5 widget-shadow flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Quote size={16} className="text-emerald-300" />
        <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Quote of the Day</span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <p className="text-white text-sm leading-relaxed italic">"{quote.text}"</p>
        <p className="text-emerald-300/80 text-xs">— {quote.author}</p>
      </div>

      <button
        onClick={shuffle}
        className="flex items-center gap-2 text-white/40 hover:text-emerald-300 transition-colors text-xs self-end"
      >
        <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
        New quote
      </button>
    </div>
  );
}
