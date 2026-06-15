import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  text: string;           // base text (e.g., "The Gather")
  accent?: string;        // accent text (e.g., ".")
  className?: string;     // override or add styling classes
  cursorColor?: string;   // cursor Tailwind color class
  delay?: number;         // initial start delay in ms
  speed?: number;         // ms per typed character
}

export default function TypewriterText({
  text,
  accent = ".",
  className = "",
  cursorColor = "bg-accent",
  delay = 200,
  speed = 80
}: TypewriterTextProps) {
  const totalLength = text.length + (accent ? accent.length : 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= totalLength) {
            clearInterval(interval);
            return totalLength;
          }
          return prev + 1;
        });
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [totalLength, delay, speed]);

  const basePart = text.slice(0, count);
  const accentPart = count > text.length && accent ? accent.slice(0, count - text.length) : "";

  // Cursor is a thin, elegant, high-contrast block that matches editorial branding
  const Cursor = () => (
    <motion.span
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
      className={`inline-block w-[3px] md:w-[6px] h-[0.75em] ${cursorColor} ml-1 md:ml-1.5 align-baseline select-none`}
    />
  );

  return (
    <span className={className}>
      {basePart}
      {accent && <span className="text-accent">{accentPart}</span>}
      {count < totalLength && <Cursor />}
    </span>
  );
}
