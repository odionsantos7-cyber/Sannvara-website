import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MascotIcon from '../../Common/Mascot';

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse", ease: "easeInOut" }}
      className="inline-block w-[3px] sm:w-[5px] xl:w-[7px] h-[0.85em] bg-accent ml-0.5 sm:ml-1 -translate-y-[0.05em] align-middle"
    />
  );
}

export default function Hero() {
  const [helloText, setHelloText] = useState('');
  const [worldText, setWorldText] = useState('');
  const [sannvaraText, setSannvaraText] = useState('');
  const [saysText, setSaysText] = useState('');
  const [hiText, setHiText] = useState('');
  
  const [cursorPosition, setCursorPosition] = useState<'line1-left' | 'line1-right' | 'line2-left' | 'line2-middle' | 'line2-right' | 'done'>('line1-left');

  const [isCycling, setIsCycling] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const cycleWords = [
    "world,",
    "brands,",
    "founders,",
    "creatives,",
    "startups,",
    "pioneers,",
    "firms,",
    "strategists,",
    "marketers,",
    "HRs,",
    "friends,",
    "Guardians,"
  ];

  useEffect(() => {
    if (cursorPosition === 'done') {
      const waitTimer = setTimeout(() => {
        setIsCycling(true);
      }, 1500);
      return () => clearTimeout(waitTimer);
    }
  }, [cursorPosition]);

  useEffect(() => {
    if (!isCycling) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % cycleWords.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isCycling]);

  useEffect(() => {
    const fullHello = "Hello";
    const fullWorld = "world,";
    const fullSannvara = "sannvara";
    const fullSays = "says";
    const fullHi = "Hi";

    let currentHello = "";
    let currentWorld = "";
    let currentSannvara = "";
    let currentSays = "";
    let currentHi = "";

    let timer: NodeJS.Timeout;

    const typeHello = (index: number) => {
      if (index < fullHello.length) {
        currentHello += fullHello[index];
        setHelloText(currentHello);
        setCursorPosition('line1-left');
        timer = setTimeout(() => typeHello(index + 1), 75);
      } else {
        timer = setTimeout(() => typeWorld(0), 160);
      }
    };

    const typeWorld = (index: number) => {
      if (index < fullWorld.length) {
        currentWorld += fullWorld[index];
        setWorldText(currentWorld);
        setCursorPosition('line1-right');
        timer = setTimeout(() => typeWorld(index + 1), 75);
      } else {
        timer = setTimeout(() => typeSannvara(0), 380);
      }
    };

    const typeSannvara = (index: number) => {
      if (index < fullSannvara.length) {
        currentSannvara += fullSannvara[index];
        setSannvaraText(currentSannvara);
        setCursorPosition('line2-left');
        timer = setTimeout(() => typeSannvara(index + 1), 75);
      } else {
        timer = setTimeout(() => typeSays(0), 160);
      }
    };

    const typeSays = (index: number) => {
      if (index < fullSays.length) {
        currentSays += fullSays[index];
        setSaysText(currentSays);
        setCursorPosition('line2-middle');
        timer = setTimeout(() => typeSays(index + 1), 75);
      } else {
        timer = setTimeout(() => typeHi(0), 160);
      }
    };

    const typeHi = (index: number) => {
      if (index < fullHi.length) {
        currentHi += fullHi[index];
        setHiText(currentHi);
        setCursorPosition('line2-right');
        timer = setTimeout(() => typeHi(index + 1), 75);
      } else {
        setCursorPosition('done');
      }
    };

    // Delay start of typing simulation slightly on mount
    timer = setTimeout(() => typeHello(0), 350);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen pt-32 pb-24 lg:py-0 overflow-hidden bg-bg-dark flex items-center">
      <div className="max-w-[1440px] px-5 md:px-[60px] w-full mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
        
        {/* Left Column: Text and Website link */}
        <div className="flex-1 flex flex-col justify-center select-none py-8 lg:py-16 transform translate-x-1 xs:translate-x-2 sm:translate-x-3 lg:translate-x-5 xl:translate-x-8 transition-transform duration-300">
          {/* Line 1: "Hello" in white roman directly followed by "world," in italic lime-green (no space) */}
          <div className="flex items-center text-[13.5vw] sm:text-[12.4vw] lg:text-[9.5vw] xl:text-[160px] leading-[0.9] tracking-[-0.06em] font-display whitespace-nowrap">
            <span className="text-bg-light font-normal">
              {helloText}
              {cursorPosition === 'line1-left' && <Cursor />}
            </span>
            {!isCycling ? (
              <span className="text-accent italic font-normal">
                {worldText}
                {cursorPosition === 'line1-right' && <Cursor />}
              </span>
            ) : (
              <span className="text-accent italic font-normal inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cycleWords[currentWordIndex]}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="inline-block"
                  >
                    {cycleWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
          </div>
          
          {/* Line 2: "sannvara says" and "Hi" with significantly reduced spacing, pulled up vertically */}
          <div className="flex items-baseline text-[11.3vw] sm:text-[10.2vw] lg:text-[7.9vw] xl:text-[134px] leading-[0.9] tracking-[-0.06em] font-display -mt-[0.3vw] sm:-mt-[0.5vw] lg:-mt-[0.4vw] xl:-mt-[6px] whitespace-nowrap">
            <span className={`text-bg-light font-normal lowercase ${sannvaraText ? 'mr-[0.16em]' : ''}`}>
              {sannvaraText}
              {cursorPosition === 'line2-left' && <Cursor />}
            </span>
            <span className={`text-bg-light font-normal lowercase ${saysText ? 'mr-[0.18em]' : ''}`}>
              {saysText}
              {cursorPosition === 'line2-middle' && <Cursor />}
            </span>
            <span className="text-accent font-normal">
              {hiText}
              {(cursorPosition === 'line2-right' || cursorPosition === 'done') && <Cursor />}
            </span>
          </div>
        </div>

        {/* Right Column: Mascot Container (fully responsive in document flow) */}
        <div className="w-full lg:w-[64%] xl:w-[68%] max-w-[700px] lg:max-w-none flex items-center justify-center lg:justify-end shrink-0 pt-4 pb-16 lg:py-16 lg:pr-16 xl:pr-28 transform -translate-y-8 xs:-translate-y-12 lg:translate-y-0 lg:-translate-x-56 xl:-translate-x-76">
          <div className="w-full h-auto select-none filter drop-shadow-2xl -rotate-3 transform scale-[1.5] xs:scale-[1.4] sm:scale-[1.3] md:scale-[1.2] lg:scale-[1.1] -translate-x-[32%] xs:-translate-x-[26%] sm:-translate-x-[20%] lg:-translate-x-[4%] transition-transform duration-300">
            <MascotIcon className="w-full h-auto max-h-[68vh] sm:max-h-[80vh] lg:max-h-[90vh] xl:max-h-[96vh]" />
          </div>
        </div>

      </div>
    </section>
  );
}


